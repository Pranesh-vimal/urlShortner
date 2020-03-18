const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const color = require("colors");
const morgan = require("morgan");

const url = require("./routes/url");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use(express.static("views"));

app.use("/", url);
app.use(morgan("common"));

app.listen(PORT, () => {
  console.log(
    color.red.bgWhite(`Server is started at http://localhost:${PORT}`)
  );
});
