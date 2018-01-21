const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commendSchema = new Schema({
  friendly: {
    type: Number,
    default: 0,
    required: true
  },
  insightful: {
    type: Number,
    default: 0,
    required: true
  },
  report: {
    type: Number,
    default: 0,
    required: true
  }
});

const Commend = mongoose.model("commend", commendSchema);

module.exports = Commend;
