const router = require("express").Router();

const authCheck = (req, res, next) => {
  if (!req.user) {
    return res.redirect("/auth/login");
  }
  next();
};

router.get("/", authCheck, (req, res) => {
  res.render("dashboard", {
    user: req.user
  });
});

module.exports = router;
