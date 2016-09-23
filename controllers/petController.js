var Pet = App.require('models/pet.js');
var auth = App.require('modules/auth.js');

exports.addSystemPet = function (req, res, next) {
    next("endpoint not secure");
    var pet = new Pet({
        name: req.body.name,
        description: req.body.description,
        image: req.body.image
    });

    App.logger.log('warn', "Request to create pet %s", pet.name);

    pet.save(function (err) {
        if (err) {
            App.logger.log('error', err);
            next("failed to crete pet. See log");
        } else {
            res.json(pet);
        }
    });
};

exports.getUsersPets = function (req, res, next) {
    Pet.find({ ownerId: req.query.userId })
        .then(function (pets) {
            res.json(pets);
        })
        .catch(function (err) {
            App.logger.log('error', err);
            next("unable to get pets");
        });
};

