// File information, f.eks. hvor der eksporteres til nederst

const express = require("express");
const router = express.Router();
const {isUserAuthenticated} = require("../references/scripts/userAuthentication");
const Post = require("../databaseModels/postModel").Post;

router.all("/*", isUserAuthenticated, (req, res, next) => {

    req.app.locals.layout = "editor";

    next();
})

// index endpoint
router.get("/", (req, res) => {
    res.render('editor/index');
});

// getPosts endpoint
router.get("/posts", (req, res) => {
    Post.find().then(posts => {
        res.render("editor/posts/index", {posts: posts});
    });
});

// createPosts endpoint
router.get("/posts/create", (req, res) => {
    res.render('editor/posts/create');
});

// submitPosts endpoint
router.post("/posts/create", (req, res) => {
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
});

//editPost endpoint
router.get("/posts/edit/:id", (req, res) => {
    const id = req.params.id;
    Post.findById(id).then(post => {
        res.render("editor/posts/edit", {post: post});
    });
});

//editPostSubmit endpoint
router.put("/posts/edit/:id", (req, res) => {
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
});

// deletePost endpoint
router.delete("/posts/delete/:id", (req, res) => {
    Post.findByIdAndDelete(req.params.id)
        .then(deletedPost => {
            req.flash("success-message", `The post ${deletedPost.title} has been deleted.`);
            res.redirect("/editor/posts");
        });
});

router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/login");
});

router.get("/posts/logout", (req, res) => {
    req.logOut();
    res.redirect("/login");
});

module.exports = router;
