//
// Authors:
// Adam Stück, Bianca Kevy, Cecilie Hejlesen
// Frederik Stær, Lasse Rasmussen and Tais Hors
//
// Group: DAT2 - C1-14
// Date: 27/05-2020

// File information, f.eks. hvor der eksporteres til (nederst)

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

    firstName: {
        type: String, required: true
    },

    lastName: {
        type: String, required: true
    },

    email: {
        type: String, required: true
    },

    password: {
        type: String, required: true
    },

    role: {
        type: String, required: true
    }
});

module.exports = {User: mongoose.model('user', userSchema )};
