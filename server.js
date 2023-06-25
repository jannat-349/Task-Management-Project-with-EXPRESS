require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

const uri = process.env.MONGODB_URI;

async function connectToMongoDB() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true });
    console.log("Database connected...");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}
connectToMongoDB();


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.json({ msg: "app successful" });
});

app.post("/users", (req, res) => {
  const user = req.body;
  const newUser = new User({
    name: user.name,
    age: user.age,
  });
  newUser
    .save()
    .then((savedUser) => {
      res.status(201).json(savedUser);
    })
    .catch((error) => {
      res.status(404).send("User not created!!");
    });
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App is listening at port ${port}`);
});
