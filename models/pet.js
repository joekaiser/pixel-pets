var mongoose = require('mongoose');



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
        default: function () {
            return moment.utc().toString();
        }
    },
    description: {
        type: String,
        required: false
    },
    ownerId: {
        type: String,
        required: true
        default: "<<system>>"
    }

});





// Export the Mongoose model
module.exports = mongoose.model('Pet', PetSchema);
