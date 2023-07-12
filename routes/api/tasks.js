const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const authenticateToken = require("../../middleware/auth");
const { handleEmailLogin, handleRefreshLogin } = require("../../utils/login");
const { body } = require("express-validator");
const errorCatcher = require("../../utils/errorCatcher");
const Task = require("../../models/Task");

router.post(
  "/",
  [authenticateToken, [body("title", "title is required").notEmpty()]],
  async (req, res) => {
    try {
      errorCatcher(req, res);
      const id = req.user.id;
      const body = req.body;
      const taskObj = new Task({
        title: body.title,
        description: body.description ?? "",
        userId: id,
      });
      await taskObj
        .save()
        .then((savedTask) => {
          res.status(201).json(savedTask);
        })
        .catch((error) => {
          res.status(404).send("Task not created!!");
        });
    } catch (error) {
      res.status(500).send(`Something Went wrong`);
    }
  }
);

router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.find({ userId: userId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).send(`Something Went wrong`);
  }
});

module.exports = router;
