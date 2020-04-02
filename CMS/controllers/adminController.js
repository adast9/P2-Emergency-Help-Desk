const Post = require("../models/PostModel").Post;

module.exports = {

  index: (req, res) => {
    res.render("admin/index");
    },

    getPosts: (req, res) => {
        Post.find().then(posts => {
            res.render("admin/posts/index", {posts: posts});
        });
    },

    createPosts: (req, res) => {
        res.render("admin/posts/create");
    },

    submitPosts: (req, res) => {
        const newPost = new Post({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
        });

        newPost.save().then(post => {
            console.log(post);
            req.flash('success-message', 'Created successfully.');
            res.redirect("/admin/posts");
        });
    }

};
