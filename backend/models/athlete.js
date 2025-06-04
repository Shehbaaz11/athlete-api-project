const mongoose = require('mongoose');

const athleteSchema = new mongoose.Schema({
    name: String,
    sport:String,
    duration:Number
})

const Athlete = mongoose.model('Athlete',athleteSchema);
module.exports = Athlete;