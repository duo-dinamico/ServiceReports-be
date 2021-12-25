const express = require("express");
const cors = require("cors");
const Boom = require("@hapi/boom");

const apiRouter = require("./routes/api.router");
const docsRouter = require("./routes/docs.router");

const app = express();
app.options("*", cors());
app.use(cors());

app.use("/api", apiRouter);
app.use("/api-docs", docsRouter);

app.all("/*", (_req, _res, next) => next(Boom.notFound("Route Not Found")));

module.exports = app;
