const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoConn");

const conn = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
module.exports = conn;
