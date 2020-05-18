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
        type: String,
        default: () => new Date().getFullYear()+'/'+(new Date().getMonth()+1)+'/'+ new Date().getDate()+' '+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds()
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
