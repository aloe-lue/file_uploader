const { Router } = require("express");
const homeRouter = Router();
const homeController = require("../../controllers/homeController/homeController");

homeRouter.get("/", homeController.home);
homeRouter.post("/sign-up", homeController.signUp);
homeRouter.post("/create-folder", homeController.postCreateFolder);

module.exports = homeRouter;
