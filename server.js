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

// app.get("/users/:id", (req, res) => {
//   const user = getUserByID(req);
//   if (user) {
//     res.status(200).json(user);
//   }
//   res.status(400).send(`User not found!!`);
// });

// app.put("/users/:id", (req, res) => {
//   const body = req.body;
//   const user = getUserByID(req);
//   if (user) {
//     user.name = body.name;
//     user.age = body.age;
//     res.status(200).json(user);
//   } else {
//     res.status(404).json({ message: "User not found!!!" });
//   }
// });

// app.delete("/users/:id", (req, res) => {
//   const id = req.params.id;
//   const userIndex = users.findIndex((u) => u.id == id);
//   if (userIndex) {
//     users.splice(userIndex, 1);
//     res.json(users);
//   } else {
//     res.status(404).json({ message: "User not found!!!" });
//   }
// });

// function getUserByID(req) {
//   const id = req.params.id;
//   const user = users.find((u) => u.id == id);
//   return user;
// }

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App is listening at port ${port}`);
});
