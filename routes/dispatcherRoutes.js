/*
Authors:
Adam Stück, Bianca Kevy, Cecilie Hejlesen
Frederik Stær, Lasse Rasmussen and Tais Hors

Group: DAT2 - C1-14
Date: 27/05-2020

This file contains the routes/endpoints for the client interaction
with the dispatcher side.
*/

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

// module is imported in app.js
module.exports = router;
