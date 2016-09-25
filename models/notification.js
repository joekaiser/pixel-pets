var mongoose = require('mongoose');
var moment = require('moment');



// Define our user schema
var NotificationSchema = new mongoose.Schema({
    title: {
        type: String
    },

    created_at: {
        type: Date,
        required: true,
        default: function() {
            return moment.utc().toString();
        }
    },
    description: {
        type: String,
        required: true
    },
    ownerId: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }

});

// Export the Mongoose model
module.exports = mongoose.model('Notification', NotificationSchema);