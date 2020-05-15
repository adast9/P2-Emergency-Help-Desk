// File information

/* Importing Different Modules */
const {globalVariables} = require("./references/scripts/configuration");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const hbs = require("express-handlebars");
const session = require("express-session");
const methodOverride = require("method-override");
const fileUpload = require("express-fileupload");
const passport = require("passport");
const flash = require("connect-flash");

/* Small const for easier use of express */
const app = express();

/* Configure Mongoose to connect to MongoDB */
let mongodbURL = 'mongodb+srv://dev:dev@clustercms-faqog.gcp.mongodb.net/cmsdb?retryWrites=true&w=majority';

mongoose.connect(mongodbURL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
    .then(response => {
        console.log("MongoDB connected successfully.");
    }).catch(err => {
        console.log("Database connection failed.");
});

/* Express */
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "references")));

/* Session */
app.use(session ({
    secret: "anysecret",
    saveUninitialized: true,
    resave: true
}));

/* Flash */
app.use(flash());

/* Passport */
app.use(passport.initialize());
app.use(passport.session());

/* Global Variables */
app.use(globalVariables);

/* File upload */
app.use(fileUpload());

// skalrettes
app.engine("handlebars", hbs({defaultLayout: "public"}));
app.set("view engine" , "handlebars");

// skalrettes
app.use(methodOverride("newMethod"));

/* Routes */
const publicRoutes = require("./routes/publicRoutes");
const editorRoutes = require("./routes/editorRoutes");
const dispatcherRoutes = require("./routes/dispatcherRoutes");

app.use("/", publicRoutes);
app.use("/editor", editorRoutes);
app.use("/dispatcher", dispatcherRoutes);

/* Start The Server */
PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
