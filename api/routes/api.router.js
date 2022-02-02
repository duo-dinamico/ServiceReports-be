const apiRouter = require("express").Router();
const {methodNotAllowed} = require("../errors");
const usersRouter = require("./users.router");

apiRouter.use("/users", usersRouter);
apiRouter.route("/").all(methodNotAllowed);

module.exports = apiRouter;
