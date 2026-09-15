const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rideRoutes = require("./routes/ride.routes.js");
const aiRoutes = require("./routes/ai.routes.js");


const app = express();

const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

const connectDB = require("./db/db");

connectDB();
app.use("/api/v1/ride",rideRoutes)
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/captain", captainRoutes);
app.use("/api/v1/ai", aiRoutes)
module.exports = app;
