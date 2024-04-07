const jwt = require("jsonwebtoken");

function jwtTokenGen(obj) {
  const token = jwt.sign(obj, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });

  return token;
}



module.exports = { jwtTokenGen };
