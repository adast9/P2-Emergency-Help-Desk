// File information, f.eks. hvor der eksporteres til (nederst)

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

module.exports = {Post: mongoose.model('post', postSchema )};
