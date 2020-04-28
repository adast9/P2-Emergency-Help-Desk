const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({

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

    file: {
        type: String,
        default: ""
    },

    file2: {
        type: String,
        default: ""
    }
});

module.exports = {Post: mongoose.model('post', PostSchema )};
