const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/user-model");
const Journal = require("../models/journal");

const authCheck = (req, res, next) => {
  if (!req.user) {
    return res.redirect("/auth/login");
  }
  next();
};

router.get("/", authCheck, (req, res) => {
  const journals = [];
  Journal.find({
    _id: { $in: req.user.journal }
  }).then(journals => {
    journals.forEach(journal => {
      journals.push(journal);
    });
    res.render("portal", {
      user: req.user,
      journals
    });
  });
});

router.post("/", (req, res) => {
  const newJournal = new Journal({
    title: req.body.title,
    entry: req.body.entry
  });
  User.findById(req.user.id).then(user => {
    user.journal.push(newJournal.id);
    Promise.all([user.save(), newJournal.save()]).then(() => {
      console.log(user.journal);
      res.redirect("/portal");
    });
  });
});

router.get("/chatroom", authCheck, (req, res) => {
  res.render("chatroom", {
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
