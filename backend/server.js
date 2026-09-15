const http = require("http");
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const app = require("./app");
const { initializeSocket } = require('./socket');

dotenv.config();

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

initializeSocket(server);

const apiKey = process.env.GEMINI_API_KEY;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
