const Post = require("../models/PostModel").Post;
const {isEmpty} = require("../config/functions");


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

       //Check for input file
       let filename = "";
       let filename2 = "";

       if(!isEmpty(req.files)) {
           let file = req.files.uploadedFile;
           filename = file.name;

           let uploadDir = "./public/uploads/images/";

           file.mv(uploadDir+filename, (err) => {
             if (err)
              throw err;
           });

           let file2 = req.files.uploadedFile2;
           filename2 = file2.name;

           let uploadDir2 = "./public/uploads/pdf/";

           file2.mv(uploadDir2+filename2, (err) => {
             if (err)
              throw err;
           });
       }

       if(filename === "" && filename2 === "") {
           filename = "stock-image.jpg";
           filename2 = "sample.pdf";
       }

       const newPost = new Post({
         title: req.body.title,
         author: req.body.author,
         file: `/uploads/images/${filename}`,
         description: req.body.description,
         status: req.body.status,
         file2: `/uploads/pdf/${filename2}`
       });

       newPost.save().then(post => {
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

    editPostSubmit: (req, res) => {

        let filename = "";
        let filename2 = "";

        if(!isEmpty(req.files)) {
            let file = req.files.uploadedFile;
            filename = file.name;

            let uploadDir = "./public/uploads/images/";

            file.mv(uploadDir+filename, (err) => {
              if (err)
               throw err;
            });

            let file2 = req.files.uploadedFile2;
            filename2 = file2.name;

            let uploadDir2 = "./public/uploads/pdf/";

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
                    req.flash("success_message", `The post ${updatePost.title} has been updated.`)
                    res.redirect("/admin/posts");
                });
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
