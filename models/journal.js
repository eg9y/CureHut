const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const journalSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  entry: {
    type: String,
    required: true
  }
});

const Journal = mongoose.model("journal", journalSchema);

module.exports = Journal;
