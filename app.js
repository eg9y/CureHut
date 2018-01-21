const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
require("dotenv").config();
const User = require("./models/user-model");

const app = express();
const authRouter = require("./routes/auth-routes");
const dashboardRouter = require("./routes/dashboard-routes");

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
    keys: [process.env.key]
  })
);

app.use(passport.initialize());
app.use(passport.session());
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// connecct to mongodb
mongoose.connect(process.env.dbURI, () => {
  console.log("connected to mongodb");
});

app.get("/", (req, res) => {
  res.render("home", {
    user: req.user
  });
});

app.use("/auth", authRouter);
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
let roomDetails = [];
let getParams;
let saveUsers;

app.get("/chatroom", authCheck, (req, res) => {
  res.render("chatroom", {
    username: req.user.username,
    roomList: users.getRoomList(),
    roomDetails,
    spectate: false
  });
});

app.get("/spectate", authCheck, (req, res) => {
  res.render("chatroom", {
    username: req.user.username,
    roomList: users.getRoomList(),
    roomDetails,
    spectate: true
  });
});

app.get("/feedback", authCheck, (req, res) => {
  res.render("feedback", {
    user: req.user,
    userList: saveUsers
  });
});

app.post("/feedback", authCheck, (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .then(user => {
      console.log("weiner", user);
      if (req.body.commend) {
        if (req.body.commend == "Friendly") {
          user.friendly++;
        } else {
          user.insightful++;
        }
      } else if (req.body.report) {
        user.reported++;
      }
      return user.save();
    })
    .then(() => {
      res.redirect("/portal");
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
    getParams = params;
    if (!isRealString(params.room)) {
      return callback("Room is required");
    }
    const room = io.sockets.adapter.rooms[params.room];
    if (room) {
      const roomLength = room.length;
      if (roomLength >= 2) {
        return callback(`Room ${params.room} already has 2 chatters`);
      }
      const checkRoomDetails = roomDetails.findIndex(room => {
        return room.room === params.room;
      });

      console.log("checkroom", checkRoomDetails);

      if (checkRoomDetails !== -1) {
        console.log(checkRoomDetails);
        roomDetails[checkRoomDetails].count++;
      }
    } else if (params.room) {
      roomDetails.push({
        room: params.room,
        count: 1
      });
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.username, params.room);

    saveUsers = users.getUserList(getParams.room);
    console.log("saveUsers", saveUsers);
    io.to(params.room).emit("sendDetails", roomDetails, params.room);

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
    if (getParams.room) {
      roomToReduce = roomDetails.findIndex(room => {
        return room.room === getParams.room;
      });
      console.log("roomToReduce", roomToReduce);
      if (
        roomToReduce !== undefined &&
        roomDetails[roomToReduce] &&
        roomDetails[roomToReduce].count > 0
      ) {
        console.log("roomtoreduce", roomToReduce);
        console.log("roomDetails", roomDetails[roomToReduce]);
        roomDetails[roomToReduce].count--;
        if (roomDetails[roomToReduce].count === 0) {
          roomDetails.splice(roomToReduce, 1);
        }
      }
    }
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
