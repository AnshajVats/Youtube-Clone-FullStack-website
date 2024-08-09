const db = require("../conf/database");
module.exports = {
  checkUsername: async function (req, res, next) {
    const username = usernameInput.value.trim();
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{2,}$/;
    if (!usernameRegex.test(username)) {
      showError(
        "Username must start with a letter and be at least 3 alphanumeric characters long."
      );
      return false;
    }
    return true;
    next();
  },
  checkEmail: async function (req, res, next) {
    next();
  },
  checkPassword: async function (req, res, next) {
    next();
  },

  checkUsernameUnique: async function (req, res, next) {
    const username = req.body.username;
    var [rows, _] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    if (rows?.length > 0) {
      req.flash("error", "Username already exists");
      return res.redirect("/register");
    } else {
      next();
    }
  },
  checkEmailUnique: async function (req, res, next) {
    const email = req.body.email;
    var [rows, _] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows?.length > 0) {
      req.flash("error", "Email already exists");
      return res.redirect("/register");
    } else {
      next();
    }
  },
};
