var mongoose = require('mongoose');
var moment = require('moment');



// Define our user schema
var PetSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: false,
        required: true
    },

    created_at: {
        type: Date,
        required: true,
        default: function() {
            return moment.utc();
        }
    },
    hatched_at: {
        type: Date,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    ownerId: {
        type: String,
        required: true,
        default: "<<system>>"
    },
    image: {
        type: String,
        required: true
    }

});

// Export the Mongoose model
module.exports = mongoose.model('Pet', PetSchema);