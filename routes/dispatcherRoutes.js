// File information, f.eks. hvad der eksporteres til nederst

const express = require("express");
const router = express.Router();
const {isUserAuthenticated} = require("../references/scripts/userAuthentication");

router.all("/*", isUserAuthenticated, (req, res, next) => {

    req.app.locals.layout = "dispatcher";

    next();
});

router.get("/", (req, res) => {
    res.render("layouts/dispatcher")
});

module.exports = router;
