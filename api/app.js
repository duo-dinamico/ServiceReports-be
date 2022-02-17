const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const Boom = require("@hapi/boom");
const {errorHandler} = require("./errors");

const apiRouter = require("./routes/api.router");
const docsRouter = require("./routes/docs.router");

const app = express();
app.options("*", cors());
app.use(cors());
app.use(helmet());

app.use((req, res, next) => {
    const {render} = res;
    const {send} = res;
    res.render = function renderWrapper(...args) {
        Error.captureStackTrace(this);
        return render.apply(this, args);
    };
    res.send = function sendWrapper(...args) {
        try {
            send.apply(this, args);
        } catch (err) {
            console.error(`Error in res.send | ${err.code} | ${err.message} | ${res.stack}`);
        }
    };
    next();
});

app.use("/api", apiRouter);
app.use("/api-docs", docsRouter);

app.all("/*", (_req, _res, next) => next(Boom.notFound("Route Not Found.")));
app.use(errorHandler);

module.exports = app;
