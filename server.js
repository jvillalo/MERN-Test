const express = require("express");
const connectDB = require("./config/db");
const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const path=require('path');

io.on("connection", function(socket) {
  console.log("a user connected");

  socket.on("disconnect", function() {
    console.log("user disconnected");
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
connectDB();

app.use(express.json({ extended: false }));

//app.get("/", (req, res) => res.send("API Running"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

if(process.env.NODE_ENV==='production'){

  app.use(express.static('client/build'))
  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  })

}

const PORT = process.env.PORT || 5001;

//app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));
http.listen(5001, function() {
  console.log("listening on *:8000");
});
