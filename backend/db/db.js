const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
  try {
    const cn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected successfully: ${cn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

module.exports = connectDB;
