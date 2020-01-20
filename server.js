const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
var model = '[{"name":"Model1","lockedByUser": 0,"levels":[]}]';
var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

//const app = express();

io.on("connection", function(socket) {
  console.log("a user connected");

  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  socket.on("modelrequest", function(msg) {
    console.log(msg);
    socket.room = msg;
    socket.join(msg);
    console.log(`new connection to model ${socket.room}`);
    io.to(socket.room).emit("model", model);

    //io.emit("model", model);
  });

  socket.on("modelupdate", function(msg) {
    console.log(msg);
    model = msg;
    io.to(socket.room).emit("model", model);
    console.log(`sent model to members of model model ${socket.room}`);
    //io.emit("model", model);
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
