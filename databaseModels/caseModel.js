/*
Authors:
Adam Stück, Bianca Kevy, Cecilie Hejlesen
Frederik Stær, Lasse Rasmussen and Tais Hors

Group: DAT2 - C1-14
Date: 27/05-2020

This file contains the scheme model for a case journal in the dispatcher side.
When archiving a case journal in the database, this is the model for the journal.
*/

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

// the module is imported in ws_server.js
module.exports = {Case: mongoose.model('case', caseSchema )};
