const express = require("express");
const cors = require("cors");

const app = express();
app.options("*", cors());
app.use(cors());

module.exports = app;
