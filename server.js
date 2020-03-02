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
    proj = msg.project;
    socket.room = msg.model;
    socket.join(msg.model);

    console.log(`new connection to model ${socket.room}`);

    try {
      let pro = await Project.findOne({ _id: proj });
      if (pro) {
        let modelToSend = "";
        pro.models.map(mod => {
          if (mod._id == msg.model) {
            modelToSend = mod.json;
          }
        });
        io.to(socket.room).emit("model", modelToSend);
      } else {
        console.log("NOT WORKING");
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

  socket.on("requestproject", async function(msg) {
    proj = msg;
    socket.room = msg;
    socket.join(msg);

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
  });

  socket.on("setproject", async function(msg) {
    proj = msg;

    try {
      let pro = await Project.findOne({ _id: proj });
      if (!pro) {
        io.to(proj).emit("project", "");
      } else {
        console.log("project sent");
        io.to(proj).emit("project", pro);
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

  socket.on("join", async function(msg) {
    socket.room = msg;
    socket.join(msg);

    console.log(`new project connection to model ${socket.room}`);
  });

  socket.on("chatrequest", async function(msg) {
    socket.room = msg.model;
    socket.join(msg.model);

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
    socket.room = msg;
    socket.join(msg);
    console.log(`new  re-connection to model ${socket.room}`);
  });

  socket.on("modelupdate", async function(msg) {
    model = msg.updateModel;
    io.to(socket.room).emit("model", model);
    console.log(`sent model to members of model ${socket.room}`);
    try {
      let proj = await Project.findOne({ _id: msg.project });
      if (proj) {
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
        });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

  socket.on("chatupdate", async function(msg) {
    cht = msg.chats;

    console.log("------->" + socket.room);
    io.to(msg.room).emit("chat", cht);

    try {
      let cht2 = await Chat.findOneAndUpdate(
        { project: msg.room },
        { $set: cht }
      );
    } catch (err) {
      console.error(err.message);
    }
  });

  socket.on("chat message", function(msg) {
    if (msg === "name") {
      io.emit("chat message", "Jorge");
    } else {
      io.emit("chat message", msg + " extra content");
    }
  });
});

connectDB();

app.use(express.json({ extended: false }));

app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/projects", require("./routes/api/projects"));
app.use("/api/chats", require("./routes/api/chat"));
app.use("/api/models", require("./routes/api/models"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5001;

http.listen(PORT, () => console.log(`Server started on port ${PORT}`));
