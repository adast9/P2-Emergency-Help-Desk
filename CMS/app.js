const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const handlebars = require("express-handlebars");
const {mongodbUrl, PORT} = require("./config/configuration.js") /*Gemmer URL i denne fil*/

const app = express();

// app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });

/*Configure express*/

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

/*View-engine with handlebars*/
app.engine("handlebars", handlebars({defaultLayout:"default"}));
app.set("view engine", "handlebars");


/*Routes*/
const defaultRoutes = require("./routes/defaultRoutes");
app.use("/", defaultRoutes);

/*Connect to MongoDB*/
mongoose.connect(mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(response => {
    console.log("Connected");
  }) .catch(err => {
    console.log("Failed to connect");
  }
)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
