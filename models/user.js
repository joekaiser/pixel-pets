var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var moment = require('moment');

var auth = App.require('modules/auth.js');

// Define our user schema
var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: function() {
            return moment.utc();
        }
    },
    roles: {
        type: Array,
        required: true,
        default: ["*"]
    },
    token: {
        type: String,
        required: true,
        unique: true,
        default: function() {
            return auth.generateBearerToken();
        }
    },
    token_expires_at: {
        type: Date,
        required: true,
        default: function() {
            var utcNow = moment.utc();
            return utcNow.add(4, 'hours');
        }
    },
    active_pet_id: {
        type: String,
        required: false
    }

});

// Execute before each user.save() call
UserSchema.pre('save', function(callback) {
    var user = this;

    // Break out if the password hasn't changed
    if (!user.isModified('password')) return callback();

    // Password changed so we need to hash it
    bcrypt.genSalt(5, function(err, salt) {
        if (err) return callback(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return callback(err);
            user.password = hash;
            callback();
        });
    });
});

UserSchema.methods.verifyPassword = function(password, cb) {

    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.methods.resetToken = function(token, cb) {
    if (token) this.token = token;
    this.token_expires_at = moment.utc().add(3, 'h').toString()
    if (cb) {
        this.save(cb);
    } else {
        return this.save();
    }
}

UserSchema.statics.findByToken = function(token) {
    return this.findOne({
        "token": token
    });
}



// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);