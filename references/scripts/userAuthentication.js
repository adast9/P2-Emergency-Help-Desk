/*
Authors:
Adam Stück, Bianca Kevy, Cecilie Hejlesen
Frederik Stær, Lasse Rasmussen and Tais Hors

Group: DAT2 - C1-14
Date: 27/05-2020

This file contains the endpoint for where a client should be redirected
if he is authenticated or not.
*/

// module is imported in dispatcherRoutes.js and editorRoutes.js
module.exports = {
    isUserAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect("/login");
        }
    }
};
