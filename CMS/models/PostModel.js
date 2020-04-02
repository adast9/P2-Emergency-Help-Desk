const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true //Skal ændres til true
  },

  status: {
    type: String,
    default: "public"
  },

  description: {
    type: String,
    required: false //Skal også ændres til true
  },

  Date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = {Post: mongoose.model('post', PostSchema )};
