const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/user-model");
const Journal = require("../models/journal");
const moment = require("moment");

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
    entry: req.body.entry,
    feeling: req.body.feeling
  });
  User.findById(req.user.id).then(user => {
    user.journal.push(newJournal.id);

    if (user.streakDate <= new Date()) {
      user.streaks++;
      user.streakDate.setDate(user.streakDate.getDate() + 1);
    }
    Promise.all([user.save(), newJournal.save()]).then(() => {
      res.redirect("/portal");
    });
  });
});

router.get("/journal", authCheck, (req, res) => {
  res.send("Add journal");
});

router.post("/journal", (req, res) => {});

module.exports = router;
