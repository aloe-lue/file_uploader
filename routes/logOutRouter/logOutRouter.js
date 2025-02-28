const { Router } = require("express");
const logOutRouter = Router();
const logOutController = require("../../controllers/logOutController/logOutController");

logOutRouter.get("/", logOutController.getLogOutUser);

module.exports = logOutRouter;
