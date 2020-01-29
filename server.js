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
//const app = express();

io.on("connection", function(socket) {
  console.log("a user connected");
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
        pro.models.map(mod => {
          if (mod._id == msg.model) {
            modelToSend = mod.json;
          }
        });
        io.to(socket.room).emit("model", modelToSend);
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

  socket.on("chatrequest", async function(msg) {
    //console.log(msg + "=========================================");
    socket.room = msg;
    socket.join(msg);
    //socket.room = msg;
    //socket.join(msg);
    //console.log(`Project: ${proj}`);
    //console.log(`USER: ${msg.user}`);
    console.log(`new chat connection to model ${socket.room}`);

    try {
      let cht = await Chat.findOne({ model: msg });
      if (cht) {
        io.to(socket.room).emit("chat", cht);
      } else {
        io.to(socket.room).emit("chat", "no chat available");
        //console.log(`HERE!!!! ${cht}`);
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
    console.log(`new chat connection to model ${socket.room}`);

   
    //io.emit("model", model);
  });




  socket.on("modelupdate", async function(msg) {
    //console.log(msg);
    model = msg.updateModel;
    io.to(socket.room).emit("model", model);
    console.log(`sent model to members of model ${socket.room}`);
    //io.emit("model", model);
    try {
      let proj = await Project.findOne({ _id: msg.project });
      if (proj) {
        //console.log(`original: ${proj}`);

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

          //console.log(`updated: ${proj2}`);
        });

        //console.log("updated");
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
    cht = msg;
    io.to(socket.room).emit("chat", msg);
    //console.log(`sent chat to members of model ${socket.room}`);
    //io.emit("model", model);
    try {
      let cht2 = await Chat.findOneAndUpdate(
        { model: msg.model },
        { $set: msg }
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
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/projects", require("./routes/api/projects"));
app.use("/api/chats", require("./routes/api/chat"));
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
