const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  googleId: String,
  journal: [
    {
      type: Schema.Types.ObjectId,
      ref: "journal"
    }
  ]
});

const User = mongoose.model("user", userSchema);

module.exports = User;
