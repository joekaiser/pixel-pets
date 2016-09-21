var User = App.require('models/user.js');
var auth = App.require("modules/auth.js")

exports.register = function (req, res, next) {
    var user = new User({
        username: req.body.username,
        password: req.body.password
    });
    App.logger.log('verbose', 'Request to create user %s', user.username);

    user.save(function (err) {
        console.log(next);
        if (err) {
            App.logger.log('error', err);
            next("failed to create user");
        } else {
            res.json({
                message: 'User created'
            });
        }
    });
};

exports.login = function (req, res, next) {

    User.findOne({
        "username": req.body.username
    }, function (err, user) {
        if (err) {
            App.logger.log('error', err);
            next('unable to lookup user');
        }
        if (user === null) {
            next("user not found");
        } else {
            user.verifyPassword(req.body.password, function (err, isMatch) {
                if (isMatch) {
                    var newToken = auth.generateBearerToken();
                    user.resetToken(newToken, function (err) {

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
                    res.status(401).send("invalid password");
                }
            });




        }
    });
};
