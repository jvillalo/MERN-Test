const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
var model = '[{"name":"Model1","lockedByUser": 0,"levels":[]}]';
var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var proj;
const Project = require("./models/Project");
//const app = express();

io.on("connection", function(socket) {
  console.log("a user connected");

  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  socket.on("modelrequest", async function(msg) {
    console.log(msg);
    proj = msg.project;
    socket.room = msg.model;
    socket.join(msg.model);
    console.log(`Project: ${proj}`);
    console.log(`USER: ${msg.user}`);
    console.log(`new connection to model ${socket.room}`);

    try {
      let pro = await Project.findOne({ _id: proj });
      if (pro) {
        let modelToSend;
        pro.models.map(mod =>
          mod._id == msg.model ? (modelToSend = mod.json) : (modelToSend = "")
        );
        io.to(socket.room).emit("model", modelToSend);
        console.log(`HERE!!!! ${modelToSend}`);
      } else {
        console.log("NOT WORKING");
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
    //io.emit("model", model);
  });

  socket.on("modelupdate", async function(msg) {
    console.log(msg);
    model = msg.updateModel;
    io.to(socket.room).emit("model", model);
    console.log(`sent model to members of model ${socket.room}`);
    //io.emit("model", model);
    try {
      let proj = await Project.findOne({ _id: msg.project });
      if (proj) {
        console.log(`original: ${proj}`);

        proj.models.map(async mod => {
          if (mod._id == msg.model) {
            mod.json = msg.updateModel;
          }
          proj.models[proj.models.indexOf({ _id: msg.model })] =
            msg.updateModel;

          let proj2 = await Project.findOneAndUpdate(
            { _id: msg.project },
            { $set: proj }
          );

          console.log(`updated: ${proj2}`);
        });

        console.log("updated");
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

  socket.on("chat message", function(msg) {
    if (msg === "name") {
      io.emit("chat message", "Jorge");
    } else {
      io.emit("chat message", msg + " extra content");
    }
    //console.log('message: ' + msg);
  });
});

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/projects", require("./routes/api/projects"));
// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5001;

http.listen(PORT, () => console.log(`Server started on port ${PORT}`));
