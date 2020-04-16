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
        return done(null, false, req.flash("error_message", "User was not found with the given Email"));
      }

      bcrypt.compare(password, user.password, (err, passwordMatched) => {
          if(err) {
              return err;
          }
          if (!passwordMatched) {
            return done(null, false, req.flash("error_message", "Invalid Email or Password"));
          }

          return done(null, user, req.flash("success_message", "Login was successful"));
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
        failureFlash: true,
        successFlash: true,
        session: true
    }), defaultController.loginPost);


router.route("/register")
    .get(defaultController.registerGet)
    .post(defaultController.registerPost);

router.route("/post/:id")
    .get(defaultController.singlePost)
    // .post(defaultController.submitComment);

router.get("/logout", (req, res) => {
    req.logOut();
    req.flash('success_message', "Logout was successful");
    res.redirect("/");
});

module.exports = router;
