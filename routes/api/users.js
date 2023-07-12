const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const authenticateToken = require("../../middleware/auth");
const { handleEmailLogin, handleRefreshLogin } = require("../../utils/login");
const { body } = require("express-validator");
const errorCatcher = require("../../utils/errorCatcher");

router.post(
  "/",
  [
    body("name", "Name is required").notEmpty(),
    body("email", "Enter a valid email").notEmpty().isEmail(),
    body("age", "Enter a valid age").optional().isNumeric(),
    body("password", "Password must be of 4 or more characters").isLength({
      min: 4,
    }),
  ],
  async (req, res) => {
    try {
      errorCatcher(req, res);
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
  }
);

router.post(
  "/login",
  [body("type", "Type is required").notEmpty()],
  async (req, res) => {
    try {
      errorCatcher(req, res);

      const { email, password, type, refreshToken } = req.body;
      if (type == "email") {
        await handleEmailLogin(email, res, password);
      } else if (type == "refresh") {
        await handleRefreshLogin(refreshToken, res);
      } else {
        res.status(404).json({ message: `type is not correct` });
      }
    } catch (error) {
      res.status(500).send(`Something Went wrong ${error}`);
    }
  }
);

router.get("/profile", authenticateToken, async (req, res) => {
  const id = req.user.id;
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

//? update a user profile api
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const id = req.user.id;
    const body = req.body;
    const user = await User.findByIdAndUpdate(id, body, {
      new: true
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: `User not found` });
    }
  } catch (error) {
    res.status(500).send(`Something Went wrong`);
  }
});

//? delete a user profile api
router.delete("/profile", authenticateToken, async (req, res) => {
  try {
    const id = req.user.id;
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

router.get("/", authenticateToken, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(`Something Went wrong`);
  }
});

module.exports = router;
