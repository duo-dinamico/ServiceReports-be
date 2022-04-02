const docsRouter = require("express").Router();
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const {methodNotAllowed} = require("../errors");

const swaggerOptions = require("../docs");

const swaggerDocs = swaggerJsdoc(swaggerOptions);

docsRouter.use("/", swaggerUi.serve);
docsRouter.get("/", swaggerUi.setup(swaggerDocs)).all(methodNotAllowed);

module.exports = docsRouter;
