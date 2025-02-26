const { Router } = require("express");
const logInRouter = Router();
const logInController = require("../../controllers/logInController/logInController");
const passport = require("passport");

logInRouter.get("/", logInController.getLogInInfo);
logInRouter.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
    failureMessage: true,
    successMessage: true,
  })
);

module.exports = logInRouter;
