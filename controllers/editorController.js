const Post = require("../models/PostModel").Post;
const {isEmpty} = require("../config/functions");


module.exports =  {

   index:  (req, res) => {
        res.render('editor/index');
    },

    getPosts: (req, res) => {
      Post.find().then(posts => {
        res.render("editor/posts/index", {posts: posts});
      });
    },

    createPosts: (req, res) => {
       res.render('editor/posts/create');
    },

    submitPosts: (req, res) => {

       let file = req.files.uploadedFile;
       let file2 = req.files.uploadedFile2;

       // Moves uploaded files to public/uploads
       file.mv("./references/uploads/images/" + req.files.uploadedFile.name, (err) => {
           if (err)
           throw err;
       });

       file2.mv("./references/uploads/pdf/" + req.files.uploadedFile2.name, (err) => {
           if (err)
           throw err;
       });

       const newPost = new Post({
         title: req.body.title,
         author: req.body.author,
         file: "/uploads/images/" + req.files.uploadedFile.name,
         description: req.body.description,
         status: req.body.status,
         file2: "/uploads/pdf/" + req.files.uploadedFile2.name
       });

       newPost.save().then(post => {
         req.flash("success-message", "Post was created Successfully.");
         res.redirect("/editor/posts");
       });
    },

    editPost: (req, res) => {
      const id = req.params.id;
      Post.findById(id).then(post => {
        res.render("editor/posts/edit", {post: post});
      });

    },

    editPostSubmit: (req, res) => {

        let filename = "";
        let filename2 = "";

        if(!isEmpty(req.files)) {
            let file = req.files.uploadedFile;
            filename = file.name;

            let uploadDir = "./references/uploads/images/";

            file.mv(uploadDir+filename, (err) => {
              if (err)
               throw err;
            });

            let file2 = req.files.uploadedFile2;
            filename2 = file2.name;

            let uploadDir2 = "./references/uploads/pdf/";

            file2.mv(uploadDir2+filename2, (err) => {
              if (err)
               throw err;
            });
        }

        const id = req.params.id;

        Post.findById(id)
            .then(post => {
                if(filename === "" && filename2 === "") {
                    post.title = req.body.title;
                    post.author = req.body.author;
                    post.file = post.file;
                    post.status = req.body.status;
                    post.description = req.body.description;
                    post.file2 = post.file2;
                }

                else if(filename != "" && filename2 != ""){
                    post.title = req.body.title;
                    post.author = req.body.author;
                    post.file = `/uploads/images/${filename}`;
                    post.status = req.body.status;
                    post.description = req.body.description;
                    post.file2 = `/uploads/pdf/${filename2}`;
                }

                post.save().then(updatePost => {
                    req.flash("success-message", `The post ${updatePost.title} has been updated.`)
                    res.redirect("/editor/posts");
                });
        });
    },

    deletePost: (req, res) => {
      Post.findByIdAndDelete(req.params.id)
        .then(deletedPost => {
          req.flash("success-message", `The post ${deletedPost.title} has been deleted.`);
          res.redirect("/editor/posts");
      });
    }
};
