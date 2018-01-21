const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
require("dotenv").config();

const app = express();
const authRouter = require("./routes/auth-routes");
const dashboardRouter = require("./routes/dashboard-routes");
const profileRouter = require("./routes/profile-routes");
const keys = require("./config/keys");

//will run passport.use later on so "google" strategy will be defined
const passportSetup = require("./config/passport-setup");

// set up view engine
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.key]
  })
);

app.use(passport.initialize());
app.use(passport.session());
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// connecct to mongodb
mongoose.connect(keys.mongodb.dbURI, () => {
  console.log("connected to mongodb");
});

app.get("/", (req, res) => {
  res.render("home", {
    user: req.user
  });
});

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/portal", dashboardRouter);

const authCheck = (req, res, next) => {
  if (!req.user) {
    return res.redirect("/auth/login");
  }
  next();
};

//////////////////////////////////////////////////////////////////////
const { generateMsg } = require("./server/utils/message.js");
const { isRealString } = require("./server/utils/validation.js");
const { Users } = require("./server/utils/users.js");

app.get("/chatroom", authCheck, (req, res) => {
  console.log("HOLLAAAAA", users.getRoomList());
  res.render("chatroom", {
    username: req.user.username,
    roomList: users.getRoomList(),
    spectate: false
  });
});

const http = require("http");
const socketIO = require("socket.io");
// use http server instead of express server
const server = http.createServer(app);
const io = socketIO(server);
let users = new Users();

io.on("connection", socket => {
  socket.on("join", (params, callback) => {
    if (!isRealString(params.room)) {
      return callback("Room is required");
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.username, params.room);
    console.log("new user connected. Room: ", users.getRoomList());

    io.to(params.room).emit("updateUserList", users.getUserList(params.room));
    socket.emit(
      "newMsg",
      generateMsg("Admin", `Welcome to room ${params.room}!`)
    );
    socket.broadcast.to(params.room).emit("newMsg", {
      from: "Admin",
      text: `User ${params.username} joined`,
      createdAt: new Date().getTime()
    });
    callback();
  });

  socket.on("createMsg", (msg, callback) => {
    const user = users.getUser(socket.id);
    if (user && isRealString(msg.text))
      io.to(user.room).emit("newMsg", generateMsg(user.username, msg.text));
    callback("dis from server");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    const user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("updateUserList", users.getUserList(user.room));
      io
        .to(user.room)
        .emit("newMsg", generateMsg("Admin", `${user.username} has quit`));
    }
  });
});

server.listen(process.env.PORT, () => {
  console.log("Listening to port 3000");
});
