const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const rideRoutes = require("./routes/ride.routes.js");
const aiRoutes = require("./routes/ai.routes.js");
const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

const connectDB = require("./db/db");
connectDB();

app.get("/", (req, res) => {
  res.status(200).send("RapidAid Backend is Running Successfully!");
});

app.use("/api/v1/ride",rideRoutes)
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/captain", captainRoutes);
app.use("/api/v1/ai", aiRoutes)
module.exports = app;
