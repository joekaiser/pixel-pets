var passport = require('passport');
var User = App.require('models/user.js');
var crypto = require('crypto');
var BearerStrategy = require('passport-http-bearer');

passport.use(new BearerStrategy(
    function (token, done) {
        User.findByToken(token, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            return done(null, user, {
                scope: 'all'
            });
        });
    }
));

exports.isAuthenticated = passport.authenticate('bearer', {
    session: false
});

exports.isAdmin = function (user) {

    return user.roles.indexOf("admin") !== -1;

}

exports.generateBearerToken = function () {
    return crypto.randomBytes(20).toString('hex');
};
