const { Router } = require("express");
const errorRouter = Router();
const errorController = require("../../controllers/errorController/errorController");

errorRouter.all("/", errorController.getError400);

module.exports = errorRouter;
