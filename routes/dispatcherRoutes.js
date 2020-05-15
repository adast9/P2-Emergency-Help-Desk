// File information, f.eks. hvad der eksporteres til nederst

const express = require("express");
const router = express.Router();
const dispatcherController = require("../controllers/dispatcherController");
const {isUserAuthenticated} = require("../references/scripts/userAuthentication");

router.all("/*", isUserAuthenticated, (req, res, next) => {

    req.app.locals.layout = "dispatcher";

    next();
});

router.route("/")
    .get(dispatcherController.getEmd);

module.exports = router;
