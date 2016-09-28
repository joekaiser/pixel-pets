var mongoose = require('mongoose');
var moment = require('moment');
var random = require("random-js")();


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
    },
    gender: {
        type: String,
        required: true,
        default: function() {
            return (random.bool() ? "male" : "female");
        }
    }

});


PetSchema.methods.giveUserAnEgg = function(userId) {


    this.ownerId = userId.toString();
    this.name = 'Egg';
    this.image = 'egg.png';
    this.description = 'This is a Pixel Pet egg. Hatch it to see what is inside!';

    return this.save();

};

module.exports = mongoose.model('Pet', PetSchema);