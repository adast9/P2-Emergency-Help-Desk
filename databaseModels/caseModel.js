// File information: fx hvor der eksporteres til

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const caseSchema = new Schema({
	id: Number,
    name: String,
    phone: String,
    cpr: String,
    pos: {
        lat: Number,
        lng: Number
    },
    desc: String,
    notes: String,
    chatLog: [String],
    timeClock: String,
    timeDate: String
});

module.exports = {Case: mongoose.model('case', caseSchema )};
