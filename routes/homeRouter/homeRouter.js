const { Router } = require("express");
const homeRouter = Router();
const homeController = require("../../controllers/homeController/homeController");

homeRouter.get("/", homeController.home);
homeRouter.post("/sign-up", homeController.signUp);

// remove this i don't have to upload file in the root
// homeRouter.post("/upload-file", homeController.postFileUpload);

homeRouter.post("/create-folder", homeController.postCreateFolder);
homeRouter.post(
  "/delete-folder/:id/:folderName",
  homeController.postDeleteFolder
);
homeRouter.post("/update-folder", homeController.postUpdateFolder);

module.exports = homeRouter;
