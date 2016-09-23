var Pet = App.require('models/pet.js');
var auth = App.require('modules/auth.js');

exports.addSystemPet = function (req, res, next) {
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

