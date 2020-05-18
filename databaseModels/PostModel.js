// File information, f.eks. hvor der eksporteres til (nederst)

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let today = new Date();

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
        type: String,
        default: today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate()
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
