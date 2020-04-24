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
        return done(null, false, req.flash("InputEmail", req.body.InputEmail), req.flash("error-message", "User was not found with the given Email"));
      }

      bcrypt.compare(password, user.password, (err, passwordMatched) => {
          if(err) {
              return err;
          }
          if (!passwordMatched) {
            return done(null, false, req.flash("InputPassword", req.body.InputPassword), req.flash("error-message", "Invalid Email or Password"));
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

router.post("/login", function(req, res, next) {
    passport.authenticate("local", function (err, user, info) {
        if(err)
        return next(err);

        if(!user){
        return res.redirect('/login');
        }

        req.logIn(user, function(err) {
           if (err){
               return next(err);
           }

           if(user.keyValue === true) {
               	return res.redirect('/admin');
            } else if(user.keyValue === false) {
                return res.redirect("/emd.html")
            }
       });
   })(req, res, next);
});

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
