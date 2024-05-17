const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("mongo connected"))
    .catch((err) => console.log(err));
};

module.exports = connectDB;
