const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcryptjs = require("bcryptjs");
const db = require("../../prisma/query");

// you want home
exports.home = (req, res) => {
  res.render("homeView/home", {
    title: "f_uplo",
    logos: "f_uplo",
    errors: [],
    openDialog: 0,
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

    if (!errors.isEmpty()) {
      res.status(400).render("homeView/home", {
        title: "f_uplo",
        logos: "f_uplo",
        errors: errors.array(),
        openDialog: 0,
      });
    }

    const { firstName, lastName, username, email, password } = req.body;
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

const emptyFolderName = "should not be left empty";
const folderLimit = "should be between 3 to 255 in length";
const folderExist = "already exist";

const folderNameValidationChain = [
  body("folderName")
    .trim()
    .custom(async (value, { req }) => {
      const { id } = req.user;
      const folder = await db.findUniqueFolder({
        folderName: value,
        userId: Number(id),
      });

      if (folder) {
        throw new Error("folder exist");
      }
    })
    .withMessage(`folder name ${folderExist}`)
    .notEmpty()
    .withMessage(`folder name ${emptyFolderName}`)
    .isLength({ min: 3, max: 255 })
    .withMessage(`folder name ${folderLimit}`),
];

exports.postCreateFolder = [
  folderNameValidationChain,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("homeView/home", {
        title: "f_uplo",
        logos: "f_uplo",
        errors: errors.array(),
        openDialog: 1,
      });
    }
    /**
     * user id specific folder
     */
    const { id } = req.user;
    const { folderName } = req.body;
    await db.createFolder({ folderName: folderName, userId: Number(id) });
    res.redirect("/");
  }),
];
