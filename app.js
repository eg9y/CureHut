const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");

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
app.use(express.static(__dirname + "/public"));

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
app.use("/dashboard", dashboardRouter);
app.use("/profile", profileRouter);

app.listen("3000", () => {
  console.log("Listening to port 3000");
});
