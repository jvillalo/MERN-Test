const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Post = require("../../models/Post");
const User = require("../../models/User");
const Project = require("../../models/Project");

router.get("/mine", auth, async (req, res) => {
  //const projects = await Project.find().sort({ date: -1 });
  const projects = await Project.find();
  let myProjects = [];
  projects.map(project => {
    project.users.map(u => {
      u.user === req.user.id &&
        // myProjects.push({ Project: project._id, Role: u.role });
        myProjects.push(project);
    });
    //myProjects.push({ project: project._id, user: project.users });
    //myProjects.push({ name: project.name, _id: project._id });

    //projects.map(project=>{
    //project.users.map(u=>u.user===req.user.id && myProjects.push(project._id))
  });

  //projects.map(project=>{
  //project.users.map(u=>u.user===req.user.id && myProjects.push(project._id))
  res.json(myProjects);
});

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

      const newProject = new Project({
        name: req.body.name,
        description: req.body.description,
        owner: req.user.id,
        users: { user: req.user.id, role: "Administrator" }
      });
      const project = await newProject.save();
      res.send(project);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

router.get("/", auth, async (req, res) => {
  const projects = await Project.find().sort({ date: -1 });
  res.json(projects);
});

router.get("/:id", auth, async (req, res) => {
  try {
    const projects = await Project.findById(req.params.id);
    if (!projects) {
      return res.status(404).json({ msg: "Project not found" });
    }

    return res.json(projects);
  } catch (err) {
    if (err.kind === "ObjectId") {
      console.error(err.message);
      return res.status(404).json({ msg: "Project not found" });
    }

    console.error(err.message);
    res.status(500).send("server error");
  }
});

router.get("/:id/users", auth, async (req, res) => {
  try {
    const projects = await Project.findById(req.params.id);
    if (!projects) {
      return res.status(404).json({ msg: "Project not found" });
    }
    const users = projects.users;

    return res.json(users);
  } catch (err) {
    if (err.kind === "ObjectId") {
      console.error(err.message);
      return res.status(404).json({ msg: "Project not found" });
    }

    console.error(err.message);
    res.status(500).send("server error");
  }
});

router.get("/:id/models", auth, async (req, res) => {
  try {
    const projects = await Project.findById(req.params.id);
    if (!projects) {
      return res.status(404).json({ msg: "Project not found" });
    }
    const models = projects.models;

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

router.put("/:id/models", auth, async (req, res) => {
  try {
    let proj = await Project.findOne({ _id: req.params.id });
    if (proj) {
      //console.log(`original: ${proj}`);

      proj.models.map(async mod => {
        if (mod._id == req.body._id) {
          mod.name = req.body.name;
          mod.json = req.body.json;
          mod.parent = req.body.parent;
        }
        //const index=proj.models.indexOf({ _id: req.body._id })
        //console.log(`====> ${index}`)
        //proj.models[index].name =req.body.name
        //proj.models[index].json = req.body.json
        //roj.models[index].parent=req.body.parent

        var proj2 = await Project.findOneAndUpdate(
          { _id: req.params.id },
          { $set: proj }
        );
      });

      return res.json(proj);
    }
  } catch (err) {
    if (err.kind === "ObjectId") {
      console.error(err.message);
      return res.status(404).json({ msg: "Project not found" });
    }

    console.error(err.message);
    res.status(500).send("server error");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ msg: "format error" });
    }
    //const posts = await Post.findByIdAndRemove(req.params.id);
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await project.remove();
    res.json({ msg: "Project removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

router.post(
  "/:id/models",
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
      //const user = await User.findById(req.body.user).select("-password");
      const project = await Project.findById(req.params.id);

      const newModel = {
        name: req.body.name,
        json: req.body.json,
        parent: req.body.parent
      };
      project.models.unshift(newModel);
      await project.save();
      res.json(project);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);
router.post(
  "/:id/users",
  [
    auth,
    [
      check("role", "role is required")
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
      //const user = await User.findById(req.body.user).select("-password");
      const project = await Project.findById(req.params.id);

      const newUser = {
        user: req.body.user,
        role: req.body.role
      };
      project.users.unshift(newUser);
      await project.save();
      res.json(project.users);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

router.put("/:id/upgrade/:user_id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    //const user = project.users.find(user => user._id === req.params.user_id);
    console.log("Here1");
    const index2 = project.users
      .map(item => item.user)
      .indexOf(req.params.user_id);
    const user = project.users[index2];
    console.log("Here5" + index2);
    if (!user) {
      console.log("Here2");
      return res.status(404).json({ msg: "user does not exist" });
    }

    console.log(project.users[index2].role);
    if (project.users[index2].role === "Guest") {
      project.users[index2].role = "Collaborator";
    } else {
      project.users[index2].role = "Administrator";
    }

    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

router.put("/:id/downgrade/:user_id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    //const user = project.users.find(user => user._id === req.params.user_id);
    console.log("Here1");
    const index2 = project.users
      .map(item => item.user)
      .indexOf(req.params.user_id);
    const user = project.users[index2];
    console.log("Here5" + index2);
    if (!user) {
      console.log("Here2");
      return res.status(404).json({ msg: "user does not exist" });
    }

    console.log(project.users[index2].role);
    if (project.users[index2].role === "Administrator") {
      project.users[index2].role = "Collaborator";
    } else {
      project.users[index2].role = "Guest";
    }

    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

router.delete("/:id/users/:user_id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    //const user = project.users.find(user => user._id === req.params.user_id);

    const index2 = project.users
      .map(item => item.user)
      .indexOf(req.params.user_id);
    const user = project.users[index2];

    if (!user) {
      return res.status(404).json({ msg: "user does not exist" });
    }

    project.users.splice(index2, 1);

    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

router.get("/:id/commitmodel/:modelid", auth, async (req, res) => {
  try {
    let project = await Project.findOne({ _id: req.params.id });

    var parent = null;
    var child = null;
    project.models.map(mod => {
      if (mod._id == req.params.modelid) {
        child = mod;
      }
    });
    console.log("2");
    project.models.map(mod => {
      if (mod._id == child.parent) {
        mod.json = child.json;
      }
    });

    var proj2 = await Project.findOneAndUpdate(
      { _id: child.parent },
      { $set: project }
    );

    const index = project.models
      .map(item => item.id)
      .indexOf(req.params.modelid);

    project.models.splice(index, 1);

    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

router.get("/:id/restoreModel/:modelid", auth, async (req, res) => {
  try {
    let project = await Project.findOne({ _id: req.params.id });

    var versiom = null;
    var editing = null;
    project.models.map(mod => {
      if (mod._id == req.params.modelid) {
        version = mod;
      }
    });

    project.models.map(mod => {
      if (mod.parent != null) {
        mod.json = version.json;
      }
    });

    var proj2 = await Project.findOneAndUpdate(
      { _id: child.parent },
      { $set: project }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

router.delete("/:id/models/:model_id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    const model = project.models.find(
      model => model.id === req.params.model_id
    );

    // Make sure comment exists
    if (!model) {
      return res.status(404).json({ msg: "model does not exist" });
    }

    // Check user

    const index = project.models
      .map(item => item.id)
      .indexOf(req.params.model_id);

    project.models.splice(index, 1);

    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
