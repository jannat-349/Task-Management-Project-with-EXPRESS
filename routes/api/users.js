const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");

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

router.post("/login", async (req, res) => {
  try {
    const { email, password, type, refreshToken } = req.body;
    if (!type) {
      res.status(404).json({ message: `type is not defined` });
    } else {
      if (type == "email") {
        await handleEmailLogin(email, res, password);
      } else {
        await handleRefreshLogin(refreshToken, res);
      }
    }
  } catch (error) {
    res.status(500).send(`Something Went wrong`);
  }
});

function getUserTokens(user, res) {
  const accesssToken = jwt.sign(
    { email: user.email, id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "2m" }
  );
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3m",
  });
  const userObj = user.toJSON();
  userObj["accessToken"] = accesssToken;
  userObj["refreshToken"] = refreshToken;
  res.status(200).json(userObj);
}
async function handleEmailLogin(email, res, password) {
  const user = await User.findOne({ email: email });
  if (user) {
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      getUserTokens(user, res);
    } else {
      res.status(401).json({ message: `Wrong Password!!` });
    }
  } else {
    res.status(404).json({ message: `User Not Found` });
  }
}

async function handleRefreshLogin(refreshToken, res) {
  if (!refreshToken) {
    res.status(404).json({ message: `No refresh token defined` });
  } else {
    jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, payload) => {
      if (err) {
        res.status(401).json({ message: `Unauthorized` });
      } else {
        const id = payload.id;
        const user = await User.findById(id);
        if (user) {
          getUserTokens(user, res);
        } else {
          res.status(404).json({ message: `User Not Found` });
        }
      }
    });
  }
}

module.exports = router;
