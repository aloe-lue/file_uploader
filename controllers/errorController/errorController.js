exports.getError400 = (req, res) => {
  res.status(400).render("errorView/error.ejs");
};
