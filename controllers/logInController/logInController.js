exports.getLogInInfo = (req, res) => {
  res.render("logInView/logIn", {
    errors: [],
    title: "f_uplo",
    logos: "f_uplo",
  });
};
