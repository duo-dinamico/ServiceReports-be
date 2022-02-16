const apiRouter = require("express").Router();
const {methodNotAllowed} = require("../errors");
const casinosRouter = require("./casinos.router");
const usersRouter = require("./users.router");
const departmentsRouter = require("./departments.router");
const machinesRouter = require("./machines.router");

apiRouter.use("/users", usersRouter);
apiRouter.use("/casinos", casinosRouter);
apiRouter.use("/departments", departmentsRouter);
apiRouter.use("/machines", machinesRouter);
apiRouter.route("/").all(methodNotAllowed);

module.exports = apiRouter;
