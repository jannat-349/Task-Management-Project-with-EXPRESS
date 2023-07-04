const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(body.password, salt);
    const password = hash;
    const userObj = new User({
      name: body.name,
      email: body.email,
      password: password,
      age: body.age,
    });
    await userObj
      .save()
      .then((savedUser) => {
        res.status(201).json(savedUser);
      })
      .catch((error) => {
        res.status(404).send("User not created!!");
      });
  } catch (error) {
    res.status(500).send(`Something Went wrong`);
  }
});

module.exports = router;
