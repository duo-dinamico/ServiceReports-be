const apiRouter = require("express").Router();
const {methodNotAllowed} = require("../errors");
const clientsRouter = require("./clients.router");
const usersRouter = require("./users.router");
const departmentsRouter = require("./departments.router");
const machinesRouter = require("./machines.router");
const servicesRouter = require("./services.router");

apiRouter.use("/users", usersRouter);
apiRouter.use("/clients", clientsRouter);
apiRouter.use("/departments", departmentsRouter);
apiRouter.use("/machines", machinesRouter);
apiRouter.use("/services", servicesRouter);
apiRouter.route("/").all(methodNotAllowed);

module.exports = apiRouter;
