const Post = require("../models/PostModel").Post;
const bcrypt = require("bcryptjs");
const User = require("../models/UserModel").User;

module.exports = {

    index:  async (req, res) => {
        const posts = await Post.find();
        res.render('default/index', {posts: posts});
    },

    loginGet: (req, res) => {
        res.render('default/login', {message: req.flash('error')});
    },

    loginPost: (req, res) => {

    },

    registerGet: (req, res) => {
        res.render('default/register');
    },

    registerPost: (req, res ) => {
        let errors = [];

        if (!req.body.firstName) {
          errors.push({message: "A First Name is required"});
        }

        if (!req.body.lastName) {
          errors.push({message: "A Last Name is required"});
        }

        if (!req.body.email) {
          errors.push({message: "An Email is required"});
        }

        if (req.body.password !== req.body.passwordConfirm) {
          errors.push({message: "The given passwords do not match"});
        }

        if(errors.length > 0) {
            res.render("default/register", {
                errors: errors,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email
            });
        }

        else {
            User.findOne({email: req.body.email}).then(user => {
                if(user) {
                    req.flash("error-message", "Email is already in use, try to login");
                    res.redirect("/login");
                }
                else {
                    const newUser = new User(req.body);

                    bcrypt.genSalt(10, (err,salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            newUser.password = hash;
                            newUser.save().then(user => {
                                req.flash("success-message", "You are now registered");
                                res.redirect("/login");
                            });
                        });
                    });
                }
            });
        }
    },

    singlePost: (req, res) => {
      const id = req.params.id;

      Post.findById(id)
        .populate({path: "comments", populate: {path: "user", model: "user"}})
        .then(post =>{
            if (!post) {
                res.status(404).json({message: "No Post was found"});
            }
            else {
                    res.render("default/singlePost", {post: post, comments: post.comments});
            }
        })
    }
};
