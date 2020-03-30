const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

/*Configure express*/

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));


/*Routes*/
app.use("/", (req, res) => {
  res.send("Is this working?");
});

/*Connect to MongoDB*/
mongoose.connect("mongodb://localhost:27017/cms", { useUnifiedTopology: true })
  .then(response => {
    console.log("Connected");
  }) .catch(err => {
    console.log("Failed to connect");
  })
