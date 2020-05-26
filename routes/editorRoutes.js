/*
Authors:
Adam Stück, Bianca Kevy, Cecilie Hejlesen
Frederik Stær, Lasse Rasmussen and Tais Hors

Group: DAT2 - C1-14
Date: 27/05-2020

This file contains the routes/endpoints for the client interaction
with the editor side.
*/

const express = require("express");
const router = express.Router();
const {isUserAuthenticated} = require("../references/scripts/userAuthentication");
const Post = require("../databaseModels/postModel").Post;

router.all("/*", isUserAuthenticated, (req, res, next) => {

    req.app.locals.layout = "editor";

    next();
})

// getDashboard endpoint
router.get("/", (req, res) => {
    Post.find().then(posts => {
        res.render("editor/", {posts: posts});
    });
});

// createPosts endpoint
router.get("/create", (req, res) => {
    res.render('editor/create');
});

// submitPosts endpoint
router.post("/create", (req, res) => {
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
        res.redirect("/editor/");
    });
});

//editPost endpoint
router.get("/edit/:id", (req, res) => {
    const id = req.params.id;
    Post.findById(id).then(post => {
        res.render("editor/edit", {post: post});
    });
});

//editPostSubmit endpoint
router.put("/edit/:id", (req, res) => {
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
                res.redirect("/editor/");
            });
        });
});


// deletePost endpoint
router.delete("/delete/:id", (req, res) => {
    Post.findByIdAndDelete(req.params.id)
        .then(deletedPost => {
            req.flash("success-message", `The post ${deletedPost.title} has been deleted.`);
            res.redirect("/editor/");
        });
});

router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/login");
});

router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/login");
});

// module is imported in app.js
module.exports = router;
