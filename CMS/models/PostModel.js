const mongoose = require("mongoose");
const schema = require("mongoose.Schema");

const postSchema = new Schema ({
  title: {
    type: String,
    required: true
  },

  status: {
    type: String,
    default: "public"
  },

  describtion: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now()
  }
});
