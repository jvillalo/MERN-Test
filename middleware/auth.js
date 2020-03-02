const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  const tkn = req.header("x-auth-token");
  if (!tkn) {
    return res.status(401).json({ msg: "auth denied" });
  }

  try {
    const payload = jwt.verify(tkn, config.get("jwtSecret"));
    req.user = payload.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "invalid token" });
  }
};
