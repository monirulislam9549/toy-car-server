const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const jwt = require("jsonwebtoken");
const port = process.env.port || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("toy car is running");
});

app.listen(port, () => {
  console.log(`toy car is running on port ${port}`);
});
