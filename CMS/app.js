const {globalVariables} = require("./config/configuration");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const handlebars = require("express-handlebars");
const {mongodbUrl, PORT} = require("./config/configuration.js"); /*Gemmer URL i denne fil*/
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require('body-parser');
const app = express();


/*Configure express*/
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

/* Session and flash */
app.use(session( {
  secret: "anysecret",
  saveUninitialized: true,
  resave: true
}));

app.use(flash());

app.use(globalVariables);

/*View-engine with handlebars*/
app.engine("handlebars", handlebars({defaultLayout:"default"}));
app.set("view engine", "handlebars");

/*Routes*/
const defaultRoutes = require("./routes/defaultRoutes");
const adminRoutes = require("./routes/adminRoutes");
app.use("/", defaultRoutes);
app.use("/admin", adminRoutes);

/*Connect to MongoDB*/
mongoose.connect(mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(response => {
    console.log("Connected to MongoDB");
  }) .catch(err => {
    console.log("Failed to connect");
  }
)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
