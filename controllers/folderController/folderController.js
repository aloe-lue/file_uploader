const asyncHandler = require("express-async-handler");
const db = require("../../prisma/query");
const { param, validationResult } = require("express-validator");
const multer = require("multer");
const path = require("node:path");
const Mimetics = require("mimetics");
const fs = require("node:fs");
const crypto = require("crypto");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  secure: true,
}).cloud_name;

// you want a better file filter in a real application tho
// file path => path.join(__dirname, "storage")
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "storage"));
  },
  filename: function (req, file, cb) {
    console.log(req.file);
    cb(null, `${crypto.randomUUID()}`);
  },
});

// set upload limitation for the curr project
const limits = {
  headerPairs: 2000,
  fileSize: 1_000_000 * 10, // <= 10 mb
  fields: 100,
  parts: 100,
  files: 100,
};

const upload = multer({
  storage: storage,
  limits: limits,
}).single("upload_folder_file");

const handleEmptyFile = function (req, res, next) {
  upload(req, res, async (err) => {
    // handle empty file and file that goes over the limits
    if (!req.file || err instanceof multer.MulterError) {
      const folderFiles = await db.readFileFolder({
        folderName: req.params.folder,
        folderId: Number(req.params.id),
      });

      return res.status(400).render(`folderView/folder`, {
        fileError: "it should not be empty nor a file greater than 10mb",
        folderName: req.params.folder,
        folderId: req.params.id,
        folderFiles: folderFiles.file,
        errors: [],
        logos: "i_uplo",
        title: "i_uplo",
      });
    } else if (err) {
      res.status(500).redirect("/");
    }

    // not empty file
    next();
  });
};

// receive only image type
const handleFakeMime = asyncHandler(async function handleFakeMime(
  req,
  res,
  next
) {
  const mimetics = new Mimetics();
  const filePath = req.file.path;
  const buffer = fs.readFileSync(filePath);
  const type = await mimetics.parseAsync(buffer);
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  if (!allowedTypes.includes(type.mime)) {
    const { folder, id } = req.params;

    // delete the file, render to safe route
    fs.unlinkSync(req.file.path);

    // show the files after failure
    const folderFiles = await db.readFileFolder({
      folderName: folder,
      folderId: Number(id),
    });

    return res.status(400).render(`folderView/folder`, {
      fileError: "file format should be jpeg/jpg, png, gif or webp",
      folderName: req.params.folder,
      folderId: req.params.id,
      folderFiles: folderFiles.file,
      errors: [],
      logos: "i_uplo",
      title: "i_uplo",
    });
  }

  // the file was valid so pass the next controller to the next handler
  next();
});

exports.postUploadFile = [
  handleEmptyFile,
  handleFakeMime,
  asyncHandler(async (req, res) => {
    // file uploaded info
    // success link
    const uploadResult = await cloudinary.uploader
      .upload(req.file.path, {
        resource_type: "image",
        overwrite: true,
      })
      .catch((error) => {
        console.error(error);
      });

    // delete from storage
    fs.unlinkSync(req.file.path);

    await db.updateFileToFolder({
      folderName: req.params.folder,
      id: Number(req.params.id),
      userId: Number(req.user.id),
      fileName: req.file.originalname,
      url: uploadResult.secure_url,
      size: Number(req.file.size),
      uploadedAt: new Date(),
      publicId: uploadResult.public_id,
    });

    // after uploaded redirect user to where client uploading was before
    res.redirect(`/folder/${req.params.folder}/read-file/id/${req.params.id}`);
  }),
];

/**
 *  down the line here is the view
 */
const folder = "it shouldn't be empty";
const id = "shouldn't be not empty";

// check if folder exist so i can fetch it's datas
const isFolderExist = asyncHandler(async (value, { req }) => {
  const id = Number(value);
  const folderName = req.params.folder;
  const userId = Number(req.user.id);

  const folder = await db.findFolderExistence({
    folderName: folderName,
    id: id,
    userId: userId,
  });

  if (!folder) {
    throw new Error("folder doesn't exist");
  }
});

const readFolderVc = [
  param("folder").trim().notEmpty().withMessage(`folder ${folder}`),
  param("id")
    .trim()
    .notEmpty()
    .withMessage(`id ${id}`)
    // use the custom
    .custom(isFolderExist)
    .withMessage("folder doesn't exist"),
];

exports.getReadFolder = [
  readFolderVc,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).redirect("/");
    }
    const folderFiles = await db.readFileFolder({
      folderName: req.params.folder,
      folderId: Number(req.params.id),
    });

    res.render("folderView/folder", {
      fileError: "",
      folderName: req.params.folder,
      folderId: req.params.id,
      folderFiles: folderFiles.file,
    });
  }),
];

exports.postUpdateFile = (req, res) => {};
exports.postDeleteFile = asyncHandler(async (req, res) => {
  // you want to delete the file that you have uploaded hmmmm yeah probably
  // const deleteResult = await cloudinary.
  // render the user to the client roots
  // single image file

  const deleteResult = await cloudinary.uploader.destroy();
});
