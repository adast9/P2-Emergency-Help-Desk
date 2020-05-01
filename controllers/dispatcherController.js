const Post = require("../models/PostModel").Post;
const {isEmpty} = require("../config/functions");

module.exports =  {

getEmd: (req, res) => {
  res.render("layouts/dispatcher")
}

};
