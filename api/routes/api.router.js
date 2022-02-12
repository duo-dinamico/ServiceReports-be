const apiRouter = require("express").Router();
const {methodNotAllowed} = require("../errors");
const casinosRouter = require("./casinos.router");
const usersRouter = require("./users.router");
const departmentsRouter = require("./departments.router");

apiRouter.use("/users", usersRouter);
apiRouter.use("/casinos", casinosRouter);
apiRouter.use("/departments", departmentsRouter);
apiRouter.route("/").all(methodNotAllowed);

module.exports = apiRouter;
