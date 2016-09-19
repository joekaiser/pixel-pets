var User = App.require('./models/user.js');

exports.register = function (req, res) {
    var user = new User({
        username: req.body.username,
        password: req.body.password
    });
    App.logger.log('verbose', 'Request to create user %s', user.username);

    user.save(function (err) {
        if (err) {
            App.logger.log('error', err);
            res.send("failed to create user");
        } else {
            res.json({
                message: 'User created'
            });
        }
    });
};

exports.getUser = function (req, res) {
    User.find(function (err, users) {
        if (err) {
            App.logger.log('error', err);
            res.send("failed to get requested user");
        }
        res.json(users);
    });
};
