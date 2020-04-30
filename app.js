/* Importing Different Modules */
const {globalVariables} = require("./config/configuration");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const hbs = require("express-handlebars");
const {mongoDbUrl, PORT} = require("./config/configuration");
const session = require("express-session");
const mongodb = require("mongodb");
const methodOverride = require("method-override");
const fileUpload = require("express-fileupload");
const passport = require("passport");
const flash = require("connect-flash");

/* Small const for easier use of express */
const app = express();

/* Cors */
app.use(require("cors")());

let mongodbURL = "mongodb+srv://dev:dev@clustercms-faqog.gcp.mongodb.net/cmsdb?retryWrites=true&w=majority";

/* Configure Mongoose to Connect to MongoDB */
mongoose.connect(mongodbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(response => {
        console.log("MongoDB Connected Successfully.");
    }).catch(err => {
        console.log("Database connection failed.");
});

/* Express*/
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "references")));

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

app.engine("handlebars", hbs({defaultLayout: "public"}));
app.set("view engine" , "handlebars");

app.use(methodOverride("newMethod"));

/* Routes */
const publicRoutes = require("./routes/publicRoutes");
const editorRoutes = require("./routes/editorRoutes");
const dispatcherRoutes = require("./routes/dispatcherRoutes");

app.use("/", publicRoutes);
app.use("/editor", editorRoutes);
app.use("/dispatcher", dispatcherRoutes);

/* Start The Server */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
