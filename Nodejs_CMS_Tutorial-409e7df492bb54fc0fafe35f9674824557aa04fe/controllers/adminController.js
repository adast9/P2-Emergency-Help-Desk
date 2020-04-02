const Post = require("../models/PostModel").Post;


module.exports =  {

   index:  (req, res) => {
        res.render('admin/index');
    },


    getPosts: (req, res) => {
       res.render("admin/posts/index");
    },

    submitPosts: (req, res) => {
       const newPost = new Post({
         title: req.body.title,
         description: req.body.description,
         status: req.body.status
       });

       newPost.save().then(post=>{
         console.log(post);
         req.flash("success_message", "Post was created Successfully.");
         res.redirect("/admin/posts");
       });
    },

    createPosts: (req, res) => {
       res.render('admin/posts/create');
    }


};
