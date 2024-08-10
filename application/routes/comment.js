const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const db = require("../conf/database");

router.post("/create", async function (req, res, next) {
  try {
    if (!req.session.user) {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized, Must be logged in" });
      return;
    }
    const { text, postId } = req.body;
    const userId = req.session.user.userId;
    const sqlStr = `insert into comments (text, fk_post_id, fk_user_id) values (?, ?, ?);`;
    const [result, _] = await db.execute(sqlStr, [text, postId, userId]);

    if (result?.affectedRows === 1) {
      res.json({
        status: "success",
        text,
        postId,
        username: req.session.user.username,
      });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Failed to create comment" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
