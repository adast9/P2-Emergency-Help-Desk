const express = require("express");
const router = express.Router();
const publicController = require("../controllers/publicController");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../databaseModels/UserModel").User;


router.all("/*", (req, res, next) => {

    req.app.locals.layout = "public";

    next();
});

router.route("/")
    .get(publicController.index);

router.route("/info")
    .get(publicController.info);

/* Local */
passport.use(new LocalStrategy({
    usernameField: "email",
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({email: email}).then(user => {
      if (!user) {
          return done(null, false, req.flash("InputEmail", req.body.InputEmail), req.flash("error-message", "The email or password is incorrect"));
      }

      bcrypt.compare(password, user.password, (err, passwordMatched) => {
          if(err) {
              return err;
          }
          if (!passwordMatched) {
            return done(null, false, req.flash("InputPassword", req.body.InputPassword), req.flash("error-message", "The email or password is incorrect"));
          }

          return done(null, user);
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
    .get(publicController.loginGet)

router.post("/login", function(req, res, next) {
    passport.authenticate("local", function (err, user) {
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
               	return res.redirect('/editor');
            } else if(user.keyValue === false) {
                return res.redirect("/dispatcher/")
            }
       });
   })(req, res, next);
});

router.route("/post/:id")
    .get(publicController.singlePost)

router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/login");
});

module.exports = router;
