const express = require("express");
const router = express.Router();
const defaultController = require("../controllers/defaultController");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/UserModel").User;


router.all("/*", (req, res, next) => {

    req.app.locals.layout = "default";

    next();
});

router.route("/")
    .get(defaultController.index);

/* Local */
passport.use(new LocalStrategy({
    usernameField: "email",
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({email: email}).then(user => {
      if (!user) {
        return done(null, false, req.flash("error-message", "The username or password is incorrect"));
      }

      bcrypt.compare(password, user.password, (err, passwordMatched) => {
          if(err) {
              return err;
          }
          if (!passwordMatched) {
            return done(null, false, req.flash("error-message", "The username or password is incorrect"));
          }

          return done(null, user, req.flash("success-message", "Login was successful"));
      });
  });
}));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

router.route("/login")
    .get(defaultController.loginGet)
    .post(passport.authenticate("local", {
        successRedirect: "/admin",
        failureRedirect: "/login",
        session: true,
    }), defaultController.loginPost);

router.route("/register")
    .get(defaultController.registerGet)
    .post(defaultController.registerPost);

router.route("/post/:id")
    .get(defaultController.singlePost)

router.get("/logout", (req, res) => {
    req.logOut();
    req.flash('success-message', "Logout was successful");
    res.redirect("/");
});

module.exports = router;
