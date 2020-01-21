const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  description: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  users: [
    {
      user: {
        type: String,
        required: true
      },
      role: {
        type: String,
        required: true
      }
    }
  ],
  models: [
    {
      name: {
        type: String,
        required: true
      },
      json: {
        type: String
      },
      parent: {
        type: String
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model("project", ProjectSchema);
