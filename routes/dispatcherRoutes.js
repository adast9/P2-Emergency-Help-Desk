const express = require("express");
const router = express.Router();
const dispatcherController = require("../controllers/dispatcherController");
const {isUserAuthenticated} = require("../references/scripts/functionForPosts");
const LocalStrategy = require("passport-local").Strategy;

router.all("/*", isUserAuthenticated, (req, res, next) => {

    req.app.locals.layout = "dispatcher";

    next();
})

router.route("/")
    .get(dispatcherController.getEmd);

module.exports = router;
