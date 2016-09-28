var passport = require('passport');
var User = App.require('models/user.js');
var crypto = require('crypto');
var BearerStrategy = require('passport-http-bearer');
var moment = require('moment');

passport.use(new BearerStrategy(
    function(token, done) {

        User.findByToken(token)
            .then(function(user) {
                if (!user) {
                    return done(null, false);
                }
                var now = moment.utc();
                var durationSinceLastCall = moment.duration(now.diff(user.token_expires_at)).asHours();

                if (durationSinceLastCall > 3) {
                    return done(null, false);
                }

                user.resetToken()
                    .then(function() {
                        return done(null, user, {
                            scope: 'all'
                        });
                    });
            })

        .catch(function(err) {
            App.logger.log('error', err);
            return done(err);
        });
    }
));

exports.isAuthenticated = passport.authenticate('bearer', {
    session: false
});

exports.isAdmin = function(user) {

    return user.roles.indexOf("admin") !== -1;

}

exports.generateBearerToken = function() {
    return crypto.randomBytes(20).toString('hex');
};