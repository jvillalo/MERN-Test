const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ModelSchema = new Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "project"
  },
  description: {
    type: String
  },
  name: {
    type: String,
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },

  json: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  version: {
    type: Number,
    default: 0
  }
});

module.exports = Model = mongoose.model("model", ModelSchema);
