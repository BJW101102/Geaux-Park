const mongoose = require('mongoose');

//Parkinglot Schema
const parkingLotSchema = new mongoose.Schema({
    lotname: {
        type: String,
    },
    id: {
        type: String,
    },
    startTime: {
        type: String,
    },
    endTime: {
        type: String,
    },
    ticketID:{
        type: Number,
    }
});

//User Scheme
const dataScheme = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    parkinglot: {
        type: [parkingLotSchema],
    }
})

module.exports = mongoose.model('Data', dataScheme);
