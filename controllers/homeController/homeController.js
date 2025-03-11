const { body, param, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcryptjs = require("bcryptjs");
const db = require("../../prisma/query");
const multer = require("multer");
const path = require("node:path");
const fs = require("node:fs");
// test package
const Mimetics = require("mimetics");
const { format, formatISO } = require("date-fns");

/**
 * renders the homepage
 * @param {*} req
 * @param {*} res
 */
exports.home = (req, res) => {
  res.render("homeView/home", {
    fileError: "",
    title: "i_uplo",
    logos: "i_uplo",
    errors: [],
    openDialog: 0,
    folderError: [],
  });
};

const empty = "is required";
const firstName = "should not contain symbols or number";
const username =
  "should be something like should be well a username like so Ali33Axe";
const password =
  "should be a strong password contains low and up case letter as well as symbols and 8 characters at minimum";
const confirmPassword = "should match password";
const email = "should be a valid email that like this johndoe@gmail.com";

const signUpValidationChain = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage(`first name ${empty}`)
    .isString()
    .withMessage(`first name ${firstName}`),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage(`last name ${empty}`)
    .isString()
    .withMessage(`last name ${firstName}`),
  body("username")
    .trim()
    .notEmpty()
    .withMessage(`username ${empty}`)
    .isString()
    .withMessage(`username ${username}`)
    .custom(async (value) => {
      const isExistingUsername = await db.findUserByUsername({
        username: value,
      });

      if (isExistingUsername) {
        throw new Error("username already in use");
      }
    }),
  body("email")
    .trim()
    .notEmpty()
    .withMessage(`Email ${empty}`)
    .isEmail()
    .withMessage(`Email ${email}`)
    .custom(async (value) => {
      const isExistingEmail = await db.findUserByEmail({ email: value });

      if (isExistingEmail) {
        throw new Error("E-mail already in use");
      }
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage(`password ${empty}`)
    .isStrongPassword()
    .withMessage(`password ${password}`),
  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage(`hmm don't leave this`)
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage(`confirm password ${confirmPassword}`),
];
exports.signUp = [
  signUpValidationChain,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    // render the same place when error occurs and show errors
    if (!errors.isEmpty()) {
      res.status(400).render("homeView/home", {
        title: "i_uplo",
        logos: "i_uplo",
        errors: errors.array(),
        openDialog: 0,
      });
    }

    const { firstName, lastName, username, email, password } = req.body;
    // i used bcrypt js it's hard to configure bcrypt from c++ technically it's way faster that's why it's preferre
    const hashedPassword = await bcryptjs.hash(password, 10);
    await db.createUser({
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      password: hashedPassword,
    });
    res.redirect("/log-in");
  }),
];

/*
 * that is cloudinary choice
 * The maximum image file size for the free plan is 10 MB.
 */

// set upload limitation for the curr project
const limits = {
  headerPairs: 2000,
  fileSize: 1_000_000 * 10, // <= 10 mb
  fields: 100,
  parts: 100,
  files: 100,
};

// you want a better file filter in a real application tho
// file path => path.join(__dirname, "storage")
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "storage"));
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: limits,
}).single("upload_file");

exports.postFileUpload = (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      res.status(400).render("homeView/home", {
        fileError: "yeah right this thing doesn't support more than 1 file",
        errors: [],
        logos: "i_uplo",
        title: "i_uplo",
      });
    }

    const mimetics = new Mimetics();
    const filePath = req.file.path;
    const buffer = fs.readFileSync(filePath);
    const type = await mimetics.parseAsync(buffer);
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (!allowedTypes.includes(type.mime)) {
      // delete the file, render to safe route
      fs.rmSync(req.file.path);
      return res.status(400).render("homeView/home", {
        fileError: "file Should be an image such as jpeg, png, gif and webp",
        errors: [],
        logos: "i_uplo",
        title: "i_uplo",
      });
    }

    // file uploaded info
    const {
      // fieldname,
      originalname,
      // encoding,
      // mimetype,
      // destination,
      // filename,
      path,
      size,
    } = req.file;
    await db.addFileToUser({
      name: originalname,
      url: `${path}${crypto.randomUUID()}`,
      size: size,
      uploadedAt: new Date(format(new Date(), "yyyy-MM-dd hh:mm")),
      userId: req.user.id,
    });
    res.redirect("/");
  });
};

const emptyFolderName = "should not be left empty";
const folderLimit = "should be between 3 to 255 in length";

const folderNameValidationChain = [
  body("folderName")
    .trim()
    .notEmpty()
    .withMessage(`folder name ${emptyFolderName}`)
    .isLength({ min: 3, max: 255 })
    .withMessage(`folder name ${folderLimit}`),
];

exports.postCreateFolder = [
  folderNameValidationChain,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    // todo: show a different error with property for the create validation
    if (!errors.isEmpty()) {
      return res.status(400).render("homeView/home", {
        fileError: "",
        title: "i_uplo",
        logos: "i_uplo",
        errors: errors.array(),
        openDialog: 1,
      });
    }
    /**
     * user id specific folder
     */
    const { id } = req.user;
    const { folderName } = req.body;
    await db.createFolder({
      folderName: folderName,
      userId: Number(id),
      dateTime: new Date(format(new Date(), "yyyy-MM-dd hh:mm")),
    });
    res.redirect("/");
  }),
];

const folderId = "should not be left empty";
const folderName = "should not be left empty";

const updateFolderVc = [
  body("folderNameAct")
    .trim()
    .notEmpty()
    .withMessage(`foldername ${folderName}`),
  body("folderIdAct").trim().notEmpty().withMessage(`folderId ${folderId}`),
  body("folderRename")
    .trim()
    .notEmpty()
    .withMessage(`folderRename ${folderName}`),
];

exports.postUpdateFolder = [
  updateFolderVc,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    // that is if there was an error validating client forms
    if (!errors.isEmpty()) {
      return res.status(400).render("homeView/home", {
        logos: "i_uplo",
        title: "i_uplo",
        folderError: errors.array(),
        errors: [],
      });
    }

    await db.updateFolder({
      folderRename: req.body.folderRename,
      folderName: req.body.folderNameAct,
      id: Number(req.body.folderIdAct),
      userId: Number(req.user.id),
    });
    res.redirect("/");
  }),
];

const idNec = "should be not be left empty";
const folderNameEmpty = "shouldn't be left empty";

const deleteFolderVc = [
  param("id").trim().notEmpty().withMessage(`Id #=> ${idNec}`),
  param("folderName")
    .trim()
    .notEmpty()
    .withMessage(`folderName ${folderNameEmpty}`),
];

exports.postDeleteFolder = [
  deleteFolderVc,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("homeView/home", {
        // this should be global but i think that would be a bad idea
        logos: "i_uplo",
        title: "i_uplo",
        folderError: errors.array(),
        errors: [],
        fileError: [],
      });
    }

    // tell db delete this folder with this info
    await db.deleteFolder({
      folderName: req.params.folderName,
      id: Number(req.params.id),
      userId: Number(req.user.id),
    });
    res.redirect("/");
  }),
];
