const express = require("express");
const app = express();
const port = 6000;
const bodyParser = require("body-parser");

app.use(bodyParser.json());

const users = [];

app.get("/", (req, res) => {
  res.json({ msg: "app successful" });
});

app.post("/users", (req, res) => {
  const user = req.body;
  users.push(user);
  res.status(201).json(user);
});

app.listen(port, () => {
  console.log(`App is listening at port ${port}`);
});
