const router = require("express").Router();
const onlineUsers = [];
const chattingUsers = [];

const authCheck = (req, res, next) => {
  if (!req.user) {
    return res.redirect("/auth/login");
  }
  next();
};

router.get("/", authCheck, (req, res) => {
  res.render("portal", {
    user: req.user
  });
});

router.get("/chat", authCheck, (req, res) => {
  onlineUsers.push(req.user);
  res.render("chat", {
    username: req.user.username
  });
});

router.get("/journal", authCheck, (req, res) => {
  res.send("Add journal");
});

router.post("/journal", (req, res) => {});

module.exports = router;
