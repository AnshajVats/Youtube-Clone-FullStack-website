var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../conf/database");
const { isLoggedIn, isMyProfile } = require("../middleware/auth");
const {
  checkUsername,
  checkPassword,
  checkEmail,
  checkUsernameUnique,
  checkEmailUnique,
} = require("../middleware/validation");
router.get("/", function (req, res, next) {
  //res.render('index', { title: 'Youtube', name:"Anshaj vats", js:['index.js'], CSS:['index.css']});
  res.end();
});

/*
 * Registor User
 * localhost:3000/users/register
 */
router.post(
  "/register",
  checkUsernameUnique,
  checkEmailUnique,
  async function (req, res, next) {
    var { username, email, password, cpassword } = req.body;
    try {
      var hashPassword = await bcrypt.hash(password, 3);
      var [resultObj, _] = await db.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashPassword]
      );
      if (resultObj?.affectedRows == 1) {
        console.log("User was created");
        req.flash("success", "User registered successfully. Please log in.");
        return res.redirect("/login");
      } else {
        console.log("User was not created");
        req.flash("error", "Failed to register user. Please try again.");
        res.redirect("/register");
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

/**
 * login User
 * localhost:3000/users/login
 */
router.post("/login", async function (req, res, next) {
  try {
    var { username, password } = req.body;
    var [rows, fields] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    var user = rows[0];
    if (!user) {
      req.flash("error", `Invalid username or password`);
      return res.redirect("/login");
    }

    //all data is good
    var isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash("error", `Invalid username or password`);
      return res.redirect("/login");
    } else {
      req.session.user = {
        username: user.username,
        userId: user.id,
        email: user.email,
      };
      req.flash("success", `${user.username} is now logged in`);
      return res.redirect("/");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

/**
 * Logout  User
 */
router.post("/logout", function (req, res, next) {
  return req.session.destroy(function (err) {
    if (err) next(err);
    res.redirect("/");
  });
});

/**
 * View profile
 */
router.get("/:id(\\d+)", isLoggedIn, isMyProfile, function (req, res, next) {
  res.render("profile");
});

module.exports = router;
