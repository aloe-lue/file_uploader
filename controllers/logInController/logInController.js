exports.getLogInInfo = (req, res) => {
  res.render("logInView/logIn", {
    errors: [],
    title: "i_uplo",
    logos: "i_uplo",
  });
};
