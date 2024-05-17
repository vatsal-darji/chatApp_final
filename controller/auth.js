const User = require("../models/authUser");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const createUser = async (req, res) => {
  const salt = bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const userObj = {
    ...req.body,
    password: hashedPassword,
  };
  try {
    const user = await User.create(userObj);
    res.redirect("/login");
  } catch (error) {
    res.status(500).send(error);
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json("User not found");
    }
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = jwt.sign(
        {
          username: user.username,
        },
        process.env.JWT_SEC
      );
      res.redirect("/index");
    } else {
      res.json("wrong credentials");
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};

module.exports = { createUser, loginUser };
