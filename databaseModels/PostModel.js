// File information, f.eks. hvor der eksporteres til (nederst)

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({

    title: {
        type: String,
        required: true
    },

    author: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    creationDate: {
        type: Date,
        default: () => Date.now()
    },

    imageFile: {
        type: String,
        default: ""
    },

    pdfFile: {
        type: String,
        default: ""
    }
});

module.exports = {Post: mongoose.model('post', postSchema )};
