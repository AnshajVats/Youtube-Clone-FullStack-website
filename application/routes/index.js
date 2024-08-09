var express = require("express");
var router = express.Router();
const { getRecentPost } = require("../middleware/post");

/* GET home page. */
router.get("/", getRecentPost, function (req, res, next) {
  res.render("index", {
    title: "Youtube",
    name: "Anshaj vats",
    js: ["index.js"],
    CSS: ["index.css"],
  });
});

/* Get the Login page*/
router.get("/login", function (req, res, next) {
  res.render("login", { title: "Login", CSS: ["login.css"] });
});

/* Get the Register page */
router.get("/register", function (req, res, next) {
  res.render("register", { title: "Register", CSS: ["register.css"] });
});

/* Get the post */
router.get("/post", function (req, res, next) {
  res.render("postvideo", {
    title: "Post",
    CSS: ["postvideo.css"],
    js: ["postVideo.js"],
  });
});

module.exports = router;
