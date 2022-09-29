const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Instantiate express
const app = express();

app.use(cors());

// Express body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/staticfiles', express.static('uploads'));
console.log(process.env.PORT);
// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("SN MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 8081;

app.listen(PORT, function () {
  console.log("App listening on port " + PORT + "!");
});

// Initialize routes middleware
app.use("/api", require("./routes/index"));
