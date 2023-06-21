require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

let users = [];
let id = 0;

app.get("/", (req, res) => {
  res.json({ msg: "app successful" });
});

app.post("/users", (req, res) => {
  const user = req.body;
  user.id = ++id;
  users.push(user);
  res.status(201).json(user);
});

app.get("/users", (req, res) => {
  res.status(200).json(users);
});

app.get("/users/:id", (req, res) => {
  const user = getUserByID(req);
  if (user) {
    res.status(200).json(user);
  }
  res.status(400).send(`User not found!!`);
});

app.put("/users/:id", (req, res) => {
  const body = req.body;
  const user = getUserByID(req);
  if (user) {
    user.name = body.name;
    user.age = body.age;
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found!!!" });
  }
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const userIndex = users.findIndex((u) => u.id == id);
  if (userIndex) {
    users.splice(userIndex, 1);
    res.json(users);
  } else {
    res.status(404).json({ message: "User not found!!!" });
  }
});

function getUserByID(req) {
  const id = req.params.id;
  const user = users.find((u) => u.id == id);
  return user;
}

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App is listening at port ${port}`);
});
