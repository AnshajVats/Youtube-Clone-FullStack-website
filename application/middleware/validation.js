const db = require("../conf/database");
module.exports = {
  checkUsername: async function (req, res, next) {
    const username = req.body.username;
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{2,}$/;
    if (usernameRegex.test(username)) {
      req.flash("error", "Username is required from backend validation");
      return res.redirect("/register");
    }
    next();
  },
  checkEmail: async function (req, res, next) {
    const email = req.body.email;
    if (email) {
      req.flash("error", "Email is required");
      return res.redirect("/register");
    }
    next();
  },
  checkPassword: async function (req, res, next) {
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    console.log(cpassword);
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[/\*\-+!@#$^&~\[\]])[A-Za-z\d/\*\-+!@#$^&~\[\]]{8,}$/;
    if (passwordRegex.test(password) && !(password === cpassword)) {
      req.flash("error", "Password is required");
      return res.redirect("/register");
    }
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
