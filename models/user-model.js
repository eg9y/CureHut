const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  googleId: {
    type: String,
    required: true
  },
  journal: [
    {
      type: Schema.Types.ObjectId,
      ref: "journal"
    }
  ],
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
  reported: {
    type: Number,
    default: 0,
    required: true
  },
  time: {
    type: Number,
    default: 60,
    required: true
  },
  spectating: {
    type: Boolean,
    required: true,
    default: false
  }
});

const User = mongoose.model("user", userSchema);

module.exports = User;
