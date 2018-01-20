const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const journalSchema = new Schema({
  title: String,
  entry: String
});

const Journal = mongoose.model("journal", userSchema);

module.exports = Journal;
