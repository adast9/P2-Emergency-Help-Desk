/*
Authors:
Adam Stück, Bianca Kevy, Cecilie Hejlesen
Frederik Stær, Lasse Rasmussen and Tais Hors

Group: DAT2 - C1-14
Date: 27/05-2020

This file contains the scheme model for a post in the editor side.
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let options = {year: "numeric", month: "2-digit", day: "2-digit", hour: "numeric", minute: "2-digit"}

const postSchema = new Schema({

    title: {
        type: String, required: true
    },

    author: {
        type: String, required: true
    },

    description: {
        type: String, required: true
    },

    creationDate: {
        type: String, default: () => new Date().toLocaleString("da-DK", options)
    },

    imageFile: {
        type: String, default: ""
    },

    pdfFile: { type: String, default: ""
    }
});

// module is imported in publicRoutes.js and editorRoutes.js
module.exports = {Post: mongoose.model('post', postSchema )};
