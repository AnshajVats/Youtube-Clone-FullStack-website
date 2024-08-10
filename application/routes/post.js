const express = require("express");
const router = express.Router();
const multer = require("multer");
const { isLoggedIn } = require("../middleware/auth");
const {
  getPostById,
  makeThumbnail,
  getCommentsByPostId,
} = require("../middleware/post");
const db = require("../conf/database");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/videos/uploads");
  },
  filename: function (req, file, cb) {
    let fileExt = file.mimetype.split("/")[1];
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExt}`);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/create",
  isLoggedIn,
  upload.single("videoUpload"),
  makeThumbnail,
  async function (req, res, next) {
    const userId = req.session.user.userId;
    console.log(userId);
    const { title, description } = req.body;
    const { path, thumbnail } = req.file;
    if (!title || !description || !path) {
      req.flash("error", "Post must have a title, description and video");
      return req.session.save((err) => {
        if (err) next(err);
        return res.redirect("/post");
      });
    }
    try {
      const [resultObj, _] = await db.query(
        `INSERT INTO posts (title, description, video, thumbnail, fk_user_id) VALUES (?, ?, ?, ?, ?)`,
        [title, description, path, thumbnail, userId]
      );

      if (resultObj?.affectedRows == 1) {
        req.flash("success", "Post created successfully");
        return req.session.save((err) => {
          if (err) next(err);
          return res.redirect(`/post/${resultObj.insertId}`);
        });
      } else {
        req.flash("error", "Failed to create post. Please try again.");
        return req.session.save((err) => {
          if (err) next(err);
          return res.redirect("/post");
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

/* Get the viewPost */
router.get(
  "/:id(\\d+)",
  getPostById,
  getCommentsByPostId,
  function (req, res, next) {
    res.render("viewPost", {
      title: "View Post",
      CSS: ["viewPost.css"],
    });
  }
);

//localhost:3000/post/search?searchterm=term
router.get("/search", async function (req, res, next) {
  try {
    const searchterm = req.query.searchterm;
    const [result, _] = await db.execute(
      `SELECT id, p.title, p.description, p.thumbnail, CONCAT_WS(" ", p.title, p.description) as haystack
from posts p
having haystack like ?;`,
      [`%${searchterm}%`]
    );
    if (result.length) {
      res.locals.posts = result;
      res.render("index", {
        title: "Youtube",
        name: "Anshaj vats",
        js: ["index.js"],
        CSS: ["index.css"],
        searchterm,
      });
    } else {
      req.flash("error", "No such post found, do you want to create one?");
      res.redirect("/post");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/likes/:id(\\d+)", isLoggedIn, function (req, res, next) {});

router.delete("/:id(\\d+)", async function (req, res, next) {});

module.exports = router;
