const { Router } = require("express");
const folderRouter = Router();
const folderController = require("../../controllers/folderController/folderController");

// upload route
folderRouter.post(
  "/:folder/upload-file/id/:id",
  folderController.postUploadFile
);

// routes the content to folder files
folderRouter.get(
  "/:folder/read-file/id/:id",
  folderController.getReadFolderFile
);

// update the file
folderRouter.post(
  "/:folder/update-file/id/:id",
  folderController.postUpdateFile
);

// delete the file
folderRouter.post(
  "/:folder/delete-file/id/:id",
  folderController.postDeleteFile
);

// download file
folderRouter.get(
  "/:folder/download-file/id/:id",
  folderController.getDownloadFile
);

module.exports = folderRouter;
