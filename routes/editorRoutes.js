// File information, f.eks. hvor der eksporteres til nederst

const express = require("express");
const router = express.Router();
const editorController = require("../controllers/editorController");
const {isUserAuthenticated} = require("../references/scripts/userAuthentication");

router.all("/*", isUserAuthenticated, (req, res, next) => {

    req.app.locals.layout = "editor";

    next();
})

router.route("/")
    .get(editorController.index);

router.route("/posts")
    .get(editorController.getPosts);

router.route("/posts/create")
    .get(editorController.createPosts)
    .post(editorController.submitPosts);

router.route("/posts/edit/:id")
    .get(editorController.editPost)
    .put(editorController.editPostSubmit);

router.route("/posts/delete/:id")
    .delete(editorController.deletePost);

router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/login");
});

router.get("/posts/logout", (req, res) => {
    req.logOut();
    res.redirect("/login");
});

module.exports = router;
