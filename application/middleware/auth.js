module.exports = {
  isLoggedIn: function (req, res, next) {
    if (req.session.user) {
      return next();
    } else {
      req.flash("error", "You must be logged in to view this page");
      return res.redirect("/login");
    }
  },
  isMyProfile: function (req, res, next) {
    const userId = req.params.id;
    if (req.session.user.userId == userId) {
      next();
    } else {
      req.flash(
        "error",
        "You do not have permission to view this page isMyProfile"
      );
      return res.redirect("/");
    }
  },
};
