/* Importing Different Modules */
const {globalVariables} = require("./config/configuration");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const exphbs = require("express-handlebars");
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
const hbs = exphbs.create({
    defaultLayout: "default",
    helpers: {
        dateFormat: function (time) {
            let year = time.getFullYear();
            let month = time.getMonth();
            if (month < 10)
                month = `0${month+1}`;
            let day = time.getDate();
            if (day < 10)
                day = `0${day}`;
            let hours = time.getHours();
            if (hours < 10)
                hours = `0${hours}`;
            let minutes = time.getMinutes();
            if (minutes < 10)
                minutes = `0${minutes}`;
            let seconds = time.getSeconds();
            if (seconds < 10)
                seconds = `0${seconds}`

            return `${day}-${month}-${year}  ${hours}:${minutes}:${seconds}`;
        }
    }
});

app.engine("handlebars", hbs.engine);
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
