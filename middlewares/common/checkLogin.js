const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXXX
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({
          message: "Invalid token!"
        })
      } else {
        req.user = decode;
        next();
      }
    })
  } else {
    res.status(401).send({message: 'No token found!'})
  }

};

module.exports = { checkLogin };
