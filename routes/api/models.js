const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Post = require("../../models/Post");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Project = require("../../models/Project");
const Model = require("../../models/Model");

router.post(
  "/",
  [
    auth,
    [
      check("name", "name is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //console.log("LOG:  " + req.user.id);
      const user = await User.findById(req.user.id).select("-password");

      const newModel = new Model({
        name: req.body.name,
        description: req.body.description,
        project: req.body.project,
        json: req.body.json,
        user: user
      });
      const model = await newModel.save();
      res.send(model);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

router.get("/", async (req, res) => {
  const models = await Model.find().sort({ date: -1 });
  res.json(models);
});

router.get("/:id", async (req, res) => {
  try {
    const models = await Model.findById(req.params.id);
    if (!models) {
      return res.status(404).json({ msg: "Model not found" });
    }

    return res.json(models);
  } catch (err) {
    if (err.kind === "ObjectId") {
      console.error(err.message);
      return res.status(404).json({ msg: "Project not found" });
    }

    console.error(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
