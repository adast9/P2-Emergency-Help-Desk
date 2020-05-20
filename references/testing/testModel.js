const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testSchema = new Schema({

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
        default: () => new Date().getFullYear()+'/'+(new Date().getMonth()+1)+'/'+ new Date().getDate()+' '+new Date().getHours()+':'+new Date().getMinutes()
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

module.exports = {Test: mongoose.model('test', testSchema )};
