const Post = require("../models/PostModel").Post;


module.exports =  {

   index:  (req, res) => {
        res.render('admin/index');
    },

    getPosts: (req, res) => {
      Post.find().then(posts => {
        res.render("admin/posts/index", {posts: posts});
      });
    },

    submitPosts: (req, res) => {
       const commentsAllowed = req.body.allowComments ? true: false;


       const newPost = new Post({
         title: req.body.title,
         description: req.body.description,
         status: req.body.status,
         allowComments: commentsAllowed
          // if ( PostSchema[7].default === true ) {
          //   .textContent = "Yes";
          // } else {
          //   .textContent = "No";
          // } -> det her kan vi tilføje, så der ikke står "true" og "false" i "Comments Allowed"-kolonnen, men derimod "Yes" og "No".
          // vi er dog i tvivl om, hvilket element der konkret skal have ændret sit .textContent, da "true" og "false" indtil videre m¨å
          // være stringified booleans.
       });

       newPost.save().then(post=>{
         console.log(post);
         req.flash("success_message", "Post was created Successfully.");
         res.redirect("/admin/posts");
       });
    },

    createPosts: (req, res) => {
       res.render('admin/posts/create');
    },

    editPost: (req, res) => {
      const id = req.params.id;
      Post.findById(id).then(post => {
        res.render("admin/posts/edit", {post: post});
      });

    },

    deletePost: (req, res) => {
      Post.findByIdAndDelete(req.params.id)
        .then(deletedPost => {
          req.flash("success_message", `The post ${deletedPost.title} has been deleted.`);
          res.redirect("/admin/posts");
      });
    }

};
