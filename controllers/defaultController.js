const Post = require("../models/PostModel").Post;
const bcrypt = require("bcryptjs");
const User = require("../models/UserModel").User;

module.exports = {

    index:  async (req, res) => {
        const posts = await Post.find();
        res.render('default/index', {posts: posts});
    },

    loginGet: (req, res) => {
        res.render('default/login', {message: req.flash('error')});
    },

    loginPost: (req, res) => {

    },

    singlePost: (req, res) => {
      const id = req.params.id;

      Post.findById(id)
        .populate({path: "comments", populate: {path: "user", model: "user"}})
        .then(post =>{
            if (!post) {
                res.status(404).json({message: "No Post was found"});
            }
            else {
                    res.render("default/singlePost", {post: post, comments: post.comments});
            }
        })
    }
};
