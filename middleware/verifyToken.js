const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.JWT_SEC;

const verifyToken = (req, res, next) => {
  const token = req.headers["Authorization"];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.redirect("/login");

    req.user = user;
    next();
  });
};

module.exports = verifyToken;
