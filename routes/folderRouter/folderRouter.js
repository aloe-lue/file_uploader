const { Router } = require("express");
const folderRouter = Router();
const folderController = require("../../controllers/folderController/folderController");

folderRouter.post(
  "/:folder/upload-file/id/:id",
  folderController.postUploadFile
);
folderRouter.get("/:folder/read-file/id/:id", folderController.getReadFolder);
folderRouter.post("/:folder/update-file/:id", folderController.postUpdateFile);
folderRouter.post("/:folder/delete-file/:id", folderController.postDeleteFile);

module.exports = folderRouter;
