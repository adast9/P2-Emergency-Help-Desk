// 
// Authors:
// Adam Stück, Bianca Kevy, Cecilie Hejlesen
// Frederik Stær, Lasse Rasmussen and Tais Hors
//
// Group: DAT2 - C1-14
// Date: 27/05-2020
//

// File information, f.eks. hvor der eksporteres til

module.exports = {
    globalVariables: (req, res, next) => {
        res.locals.success_message = req.flash("success-message");
        res.locals.error_message = req.flash("error-message");
        next();
    }
};
