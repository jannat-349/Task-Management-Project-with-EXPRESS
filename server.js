require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/db");
const User = require("./models/User");


app.use(bodyParser.json());

connectDB();

app.get("/", (req, res) => {
  res.json({ msg: "app successful" });
});

app.use("/api/users", require("./routes/api/users"));


const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App is listening at port ${port}`);
});
