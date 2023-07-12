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

router.get("/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  try {
    const task = await Task.findOne({ _id: id, userId: userId });
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: `Task not found` });
    }
  } catch (error) {
    res.status(500).send(`Something Went wrong`);
  }
});

router.put(
  "/status/:id",
  [
    authenticateToken,
    [
      body("status", "status is not valid").isIn([
        "to-do",
        "in-progress",
        "done",
      ]),
    ],
  ],
  async (req, res) => {
    try {
      errorCatcher(req, res);
      const id = req.params.id;
      const userId = req.user.id;
      const task = await Task.findOneAndUpdate(
        { _id: id, userId: userId },
        { status: req.body.status },
        {
          new: true,
        }
      );
      if (task) {
        res.status(200).json(task);
      } else {
        res.status(404).json({ message: `Task not found` });
      }
    } catch (error) {
      res.status(500).send(`Something Went wrong`);
    }
  }
);

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const body = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: userId },
      body,
      {
        new: true,
      }
    );
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: `Task not found` });
    }
  } catch (error) {
    res.status(500).send(`Something Went wrong`);
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const userId =  req.user.id;
    const task = await Task.findOneAndDelete({_id: id, userId: userId});
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: `Task not found` });
    }
  } catch (error) {
    res.status(500).send(`Something Went wrong`);
  }
});

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
