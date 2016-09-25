var User = App.require('models/user.js');
var Pet = App.require('models/pet.js');
var Auth = App.require("modules/auth.js");
var Notification = App.require('models/notification.js');

var moment = require('moment');


exports.register = function(req, res, next) {

    App.logger.log('verbose', 'Request to create user %s', req.body.username);



    var user = new User({
        username: req.body.username,
        password: req.body.password
    });

    user.save()
        .then(function() {
            return Pet.findOne({
                "name": "Egg",
                "ownerId": "<<system>>"
            })
        })
        .then(function(pet) {
            var newPet = pet.toObject();
            delete newPet._id;
            newPet.ownerId = user._id;
            newPet.created_at = moment.utc().toString();
            return new Pet(newPet).save();
        })
        .then(function() {
            var note = new Notification({
                ownerId: user._id,
                title: '',
                description: 'You found an egg! Hatch it to see what is inside.'
            });

            return note.save();
        })
        .then(function() {
            res.json({ message: 'User created' });
        })
        .catch(function(err) {

            if (user != null) {
                Pet.remove({ ownerId: user._id });
                user.remove();
            }

            App.logger.log('error', err);
            next(err);
        });
};

exports.login = function(req, res, next) {

    User.findOne({
        "username": req.body.username
    }, function(err, user) {
        if (err) {
            App.logger.log('error', err);
            next('User lookup failed. Please try later');
        }
        if (user === null) {
            next(req.body.username + " is not a valid username");
        } else {
            user.verifyPassword(req.body.password, function(err, isMatch) {
                if (isMatch) {
                    var newToken = Auth.generateBearerToken();
                    user.resetToken(newToken, function(err) {

                        if (err) {
                            App.logger.log('error', err);
                            res.send("unable to save new session token");
                        } else {
                            res.json({
                                username: user.username,
                                roles: user.roles,
                                id: user._id,
                                token: newToken
                            });
                        }
                    });
                } else {
                    res.status(401).send("The password was wrong");
                }
            });




        }
    });
};

exports.notifications = function(req, res, next) {
    Notification.find({ ownerId: req.query.userId })
        .then(function(notes) {
            res.json(notes);
        })
        .catch(function(err) {
            App.logger.log('error', err);
            next("unable to get notifications");
        });
};