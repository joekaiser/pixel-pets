var Pet = App.require('models/pet.js');
var auth = App.require('modules/auth.js');
var ErrorHandler = App.require('errorHandler.js');
var random = require("random-js")();
var moment = require('moment');



var petKeys = [
    "basey", "misti", "neap", "polly", "rusty", "sampson", "scooter", "wagar"
];

exports.addSystemPet = function(req, res, next) {
    next("endpoint not secure");
    var pet = new Pet({
        name: req.body.name,
        description: req.body.description,
        image: req.body.image
    });

    App.logger.log('warn', "Request to create pet %s", pet.name);

    pet.save(function(err) {
        if (err) {
            ErrorHandler.logAndSend(err, "failed to create pet", next);
        } else {
            res.json(pet);
        }
    });
};

exports.getUsersPets = function(req, res, next) {
    Pet.find({ ownerId: req.query.userId }).where('name').ne('Egg')
        .then(function(pets) {
            res.json(pets);
        })
        .catch(function(err) {
            ErrorHandler.logAndSend(err, "failed to get pets for user", next);
        });
};

exports.getUsersEggs = function(req, res, next) {
    Pet.find({ ownerId: req.query.userId }).where('name').eq('Egg')
        .then(function(pets) {
            res.json(pets);
        })
        .catch(function(err) {
            ErrorHandler.logAndSend(err, "failed to get eggs for user", next);
        });
};

exports.hatchEgg = function(req, res, next) {
    Pet.findOne({ _id: req.body.id })
        .then(function(egg) {
            if (!egg) {
                return ErrorHandler.logAndSend("Egg " + req.body.id + " not found", "egg not found", next);
            }
            if (egg.name !== 'Egg' && egg.ownerId !== req.body.userId) {

                var m = {};
                m.message = "failed to hatch an egg";
                m.type = egg.name;
                m.id = egg.id;
                m.eggOwnerId = egg.ownerId;
                m.requestedByOwner = req.body.ownerId;
                return ErrorHandler.logAndSend(m, "failed to hatch the egg", next);
            }

            var pick = random.pick(petKeys, 0, petKeys.length);
            egg.name = pick;
            egg.image = pick + ".png";
            egg.hatched_at = moment.utc();

            return egg.save();

        })
        .then(function(egg) {
            res.send(egg);
        })
        .catch(function(err) {
            return ErrorHandler.logAndSend(err, "failed to hatch the egg", next);
        });
};