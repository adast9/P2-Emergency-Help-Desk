// File information

const Post = require("../databaseModels/postModel").Post;

// Module is exported so it can be imported in "editorRoutes"
module.exports = {

    index: (req, res) => {
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
        let imageFile = req.files.uploadedImageFile;
        let pdfFile = req.files.uploadedPdfFile;

        // Moves uploaded files to public/uploads
        imageFile.mv("./references/uploads/images/" + req.files.uploadedImageFile.name, (err) => {
            if (err)
            throw err;
        });

        pdfFile.mv("./references/uploads/pdf/" + req.files.uploadedPdfFile.name, (err) => {
            if (err)
            throw err;
        });

        const newPost = new Post({
            title: req.body.title,
            author: req.body.author,
            imageFile: "/uploads/images/" + req.files.uploadedImageFile.name,
            description: req.body.description,
            pdfFile: "/uploads/pdf/" + req.files.uploadedPdfFile.name
        });

        newPost.save().then(post => {
            req.flash("success-message", "Post was created successfully.");
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
        let imageFile = req.files.uploadedImageFile;
        let pdfFile = req.files.uploadedPdfFile;

        // Moves uploaded files to public/uploads
        imageFile.mv("./references/uploads/images/" + req.files.uploadedImageFile.name, (err) => {
            if (err)
            throw err;
        });

        pdfFile.mv("./references/uploads/pdf/" + req.files.uploadedPdfFile.name, (err) => {
            if (err)
            throw err;
        });

        const id = req.params.id;

        Post.findById(id)
            .then(post => {
                post.title = req.body.title;
                post.author = req.body.author;
                post.imageFile = "/uploads/images/" + req.files.uploadedImageFile.name;
                post.description = req.body.description;
                post.pdfFile = "/uploads/pdf/" + req.files.uploadedPdfFile.name;

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
