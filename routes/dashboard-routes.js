const router = require("express").Router();

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
  res.render("chat", {
    username: req.user.username,
    spectate: false
  });
});

router.get("/spectate", authCheck, (req, res) => {
  res.render("chat", {
    username: req.user.username,
    spectate: true
  });
});

router.get("/journal", authCheck, (req, res) => {
  res.send("Add journal");
});

router.post("/journal", (req, res) => {});

module.exports = router;
