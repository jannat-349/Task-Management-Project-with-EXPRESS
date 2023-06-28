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

const userSchema = new mongoose.Schema(
  {
    name: String,
    age: Number,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.json({ msg: "app successful" });
});

app.post("/users", async (req, res) => {
  const user = req.body;
  const newUser = new User({
    name: user.name,
    age: user.age,
  });
  await newUser
    .save()
    .then((savedUser) => {
      res.status(201).json(savedUser);
    })
    .catch((error) => {
      res.status(404).send("User not created!!");
    });
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(`Something Went wrong`);
  }
});

app.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: `User not found` });
    }
  } catch (error) {
    res.status(500).send(`Something Went wrong`);
  }
});

app.put("/users/:id", async(req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const user = await User.findByIdAndUpdate(id, body, { new: true , strict: false });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: `User not found` });
    }
  } catch (error) {
    res.status(500).send(`Something Went wrong`);
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: `User not found` });
    }
  } catch (error) {
    res.status(500).send(`Something Went wrong`);
  }
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App is listening at port ${port}`);
});
