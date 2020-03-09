const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
var model = '[{"name":"Model1","lockedByUser": 0,"levels":[]}]';
var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var proj;
const Project = require("./models/Project");
const Chat = require("./models/Chat");
const Model = require("./models/Model");
//const app = express();

io.on("connection", function(socket) {
  console.log("a user connected" + socket.room);
  socket.emit("reconn");

  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  socket.on("newmsg", function() {
    console.log("chat message emmited");
    io.emit("chat");
  });

  socket.on("modelrequest", async function(msg) {
    //console.log(msg);
    proj = msg.project;
    socket.room = msg.model;
    socket.join(msg.model);
    //console.log(`Project: ${proj}`);
    //console.log(`USER: ${msg.user}`);
    console.log(`new connection to model ${socket.room}`);

    try {
      let pro = await Project.findOne({ _id: proj });
      if (pro) {
        let modelToSend = "";
        let version = 0;
        pro.models.map(mod => {
          if (mod._id == msg.model) {
            modelToSend = mod.json;
            version = mod.version;
          }
        });

        const payload = {
          json: modelToSend,
          version: version
        };
        io.to(msg.model).emit("model", payload);
        console.log(`HERE!!!! ${payload.json}`);
      } else {
        console.log("NOT WORKING");
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
    //io.emit("model", model);
  });

  socket.on("requestproject", async function(msg) {
    //console.log(msg);
    proj = msg;
    socket.room = msg;
    socket.join(msg);
    //console.log(`Project: ${proj}`);
    //console.log(`USER: ${msg.user}`);
    console.log(`new connection to model ${socket.room}`);

    try {
      let pro = await Project.findOne({ _id: msg });
      if (pro) {
        io.to(socket.room).emit("project", pro);
        //console.log(`HERE!!!! ${modelToSend}`);
      } else {
        console.log("NOT WORKING");
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
    //io.emit("model", model);
  });

  socket.on("setproject", async function(msg) {
    //console.log(msg);
    proj = msg;

    try {
      let pro = await Project.findOne({ _id: proj });
      if (!pro) {
        io.to(proj).emit("project", "");
      } else {
        console.log("project sent");
        io.to(proj).emit("project", pro);
      }
      //console.log(`HERE!!!! ${modelToSend}`);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
    //io.emit("model", model);
  });

  socket.on("join", async function(msg) {
    //console.log(msg + "=========================================");
    socket.room = msg;
    socket.join(msg);
    //socket.room = msg;
    //socket.join(msg);
    //console.log(`Project: ${proj}`);
    //console.log(`USER: ${msg.user}`);
    console.log(`new project connection to model ${socket.room}`);

    //io.emit("model", model);
  });

  socket.on("chatrequest", async function(msg) {
    //console.log(msg + "=========================================");

    socket.room = msg.model;
    socket.join(msg.model);

    //socket.room = msg;
    //socket.join(msg);
    //console.log(`Project: ${proj}`);
    //console.log(`USER: ${msg.user}`);
    console.log(`new chat connection to model ${socket.room}`);

    try {
      let cht = await Chat.findOne({ project: msg.project });
      if (cht) {
        io.to(socket.room).emit("chat", cht);
      } else {
        io.to(socket.room).emit("chat", "no chat available");
        console.log(`HERE!!!! ${cht}`);
      }
    } catch (err) {
      console.error(err.message);
      //res.status(500).send("Server error");
    }
    //io.emit("model", model);
  });

  socket.on("reconnection", async function(msg) {
    //console.log(msg + "=========================================");
    socket.room = msg;
    socket.join(msg);
    //socket.room = msg;
    //socket.join(msg);
    //console.log(`Project: ${proj}`);
    //console.log(`USER: ${msg.user}`);
    console.log(`new  re-connection to model ${socket.room}`);

    //io.emit("model", model);
  });

  socket.on("modelupdate", async function(msg) {
    //console.log(msg);

    try {
      let proj = await Project.findOne({ _id: msg.project });

      if (proj) {
        proj.models.map(async mod => {
          if (mod._id == msg.model) {
            console.log("=======versions: " + mod.version + " " + msg.version);
            if (mod.version === msg.version) {
              model = msg.updateModel;
              const newversion = mod.version + 1;
              const payload = {
                json: model,
                version: newversion
              };
              io.to(msg.model).emit("model", payload);
              console.log(`sent model to members of model ${socket.room}`);

              mod.json = model;
              mod.version = newversion;

              let proj2 = await Project.findOneAndUpdate(
                { _id: msg.project },
                { $set: proj }
              );
            } else {
              const payload = {
                json: mod.json,
                version: mod.version
              };
              console.log(`Wrong version`);
              socket.emit("model", payload);
            }
          }
        });

        //console.log("updated");
        if (msg.log) {
          var newComment = msg.log;
          let chat = await Chat.findOne({ project: msg.project });
          chat.comments.unshift(newComment);

          //console.log(`sent chat to members of model ${socket.room}`);
          //io.emit("model", model);

          let cht2 = await Chat.findOneAndUpdate(
            { project: msg.project },
            { $set: chat }
          );

          io.to(socket.room).emit("chat", chat);
        }
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

  socket.on("chatupdate", async function(msg) {
    //console.log("------------------------------------");
    //user = msg.user;
    //console.log(msg);
    cht = msg.chats;

    console.log("------->" + socket.room);
    io.to(msg.room).emit("chat", cht);

    //console.log(`sent chat to members of model ${socket.room}`);
    //io.emit("model", model);
    try {
      let cht2 = await Chat.findOneAndUpdate(
        { project: msg.room },
        { $set: cht }
      );

      //console.log(`updated: ${cht2}`);
    } catch (err) {
      console.error(err.message);
      //res.status(500).send("Server error");
    }
  });

  socket.on("chatupdate2", async function(msg) {
    //console.log("------------------------------------");
    //user = msg.user;
    try {
      //console.log(msg);
      newComment = msg.chats;
      let chat = await Chat.findOne({ project: msg.room });
      chat.comments.unshift(newComment);

      console.log("------->" + socket.room);
      io.to(msg.room).emit("chat", chat);

      //console.log(`sent chat to members of model ${socket.room}`);
      //io.emit("model", model);

      let cht2 = await Chat.findOneAndUpdate(
        { project: msg.room },
        { $set: chat }
      );

      //console.log(`updated: ${cht2}`);
    } catch (err) {
      console.error(err.message);
      //res.status(500).send("Server error");
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
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/projects", require("./routes/api/projects"));
app.use("/api/chats", require("./routes/api/chat"));
app.use("/api/models", require("./routes/api/models"));

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
