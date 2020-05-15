// File information, f.eks. hvor der eksporteres til

module.exports = {
    isUserAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect("/login");
        }
    }
};
