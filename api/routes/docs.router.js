const docsRouter = require("express").Router();
const {methodNotAllowed} = require("../errors");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../docs");

docsRouter.use("/", swaggerUi.serve);
docsRouter.get("/", swaggerUi.setup(swaggerDocument)).all(methodNotAllowed);

module.exports = docsRouter;
