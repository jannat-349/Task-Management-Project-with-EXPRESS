const express = require("express");
const app = express();
const port = 6000;
const bodyParser = require("body-parser");

app.use(bodyParser.json());

const users = [];
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

app.get('/users', (req, res) => {
    res.status(200).json(users);
})

app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    const user = users.find((u) => u.id==id)
    if(user) {
        res.status(200).json(user);
    }
    res.status(400).send(`User not found!!`)
})

app.listen(port, () => {
  console.log(`App is listening at port ${port}`);
});
