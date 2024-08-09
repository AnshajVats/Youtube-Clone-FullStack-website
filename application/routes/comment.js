const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");

router.post("/create", isLoggedIn, function (req, res, next) {});

module.exports = router;
