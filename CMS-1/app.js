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

const app = express();

// Includes cors for cross resource sharing
app.use(require("cors")());

// Configure Mongoose to Connect to MongoDB
mongoose.connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(response => {
        console.log("MongoDB Connected Successfully.");
    }).catch(err => {
        console.log("Database connection failed.");
});

/* Configure express*/
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

/*Flash and sesseion*/
app.use(session({
  secret: "anysecret",
  saveUninitialized: true,
  resave: true
}));

app.use(flash());

/* Global Variables*/
app.use(globalVariables);

/* File Upload */
app.use(fileUpload());


/* Setup View Engine To Use Handlebars */
app.engine("handlebars", hbs({defaultLayout: "default"}));
app.set("view engine" , "handlebars");

/*Method Override middleware*/
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
