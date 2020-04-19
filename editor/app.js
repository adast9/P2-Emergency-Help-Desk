/* Importing Different Modules */
const {globalVariables} = require("./config/configuration");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const hbs = require("express-handlebars");
const {mongoDbUrl, PORT} = require("./config/configuration");
const flash = require("connect-flash");
const session = require("express-session");
const mongodb = require("mongodb");
const methodOverride = require("method-override");
const fileUpload = require("express-fileupload");
const passport = require("passport");

/* Small const for easier use of express */
const app = express();

/* Cors */
app.use(require("cors")());

/* Configure Mongoose to Connect to MongoDB */
mongoose.connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(response => {
        console.log("MongoDB Connected Successfully.");
    }).catch(err => {
        console.log("Database connection failed.");
});

/* Express*/
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

/* Session*/
app.use(session({
  secret: "anysecret",
  saveUninitialized: true,
  resave: true
}));

/* Flash */
app.use(flash());

/* Passport */
app.use(passport.initialize());
app.use(passport.session());

/* Global Variables*/
app.use(globalVariables);

/* File Upload */
app.use(fileUpload());


/* Handlebars */
app.engine("handlebars", hbs({defaultLayout: "default"}));
app.set("view engine" , "handlebars");

app.use(methodOverride("newMethod"));

/* Routes */
const defaultRoutes = require("./routes/defaultRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/", defaultRoutes);
app.use("/admin", adminRoutes);


/* Start The Server */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
