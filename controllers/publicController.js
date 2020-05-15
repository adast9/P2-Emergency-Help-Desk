// File information

const Post = require("../databaseModels/PostModel").Post;
const bcrypt = require("bcryptjs");
const User = require("../databaseModels/UserModel").User;

module.exports = {

    index: (req, res) => {
        res.render("public/index");
    },

    info: async (req, res) => {
        const posts = await Post.find();
        res.render('public/info', {posts: posts});
    },

    loginGet: (req, res) => {
        res.render('public/login', {message: req.flash('error')});
    },

    loginPost: (req, res) => {
        // skalrettes
    },

    singlePost: (req, res) => {
        const id = req.params.id;

        // skalrettes
        // Dette skal redigeres senere
        Post.findById(id)
            .populate({path: "comments", populate: {path: "user", model: "user"}})
            .then(post => {
                if (!post) {
                    res.status(404).json({message: "No Post was found"});
                } else {
                    res.render("public/singlePost", {post: post, comments: post.comments});
                }
            })
    }
};
