const db = require("../conf/database");
const { exec } = require("child_process");
const pathToFFMPEG = require("ffmpeg-static");
module.exports = {
  makeThumbnail: async function (req, res, next) {
    if (!req.file) {
      next(new Error("File upload failed"));
    } else {
      try {
        var destinationOfThumbnail = `public/images/uploads/thumbnail-${
          req.file.filename.split(".")[0]
        }.png`;
        console.log("Thumbnail destination:", destinationOfThumbnail);
        var thumbnailCommand = `"${pathToFFMPEG}" -ss 00:00:01 -i ${req.file.path} -y -s 200x200 -vframes 1 -f image2 ${destinationOfThumbnail}`;
        console.log("FFMPEG command:", thumbnailCommand);
        var { stdout, stderr } = await exec(thumbnailCommand);
        console.log("FFMPEG stdout:", stdout);
        console.log("FFMPEG stderr:", stderr);
        req.file.thumbnail = destinationOfThumbnail.replace("public/", ""); // Remove 'public/' from path
        next();
      } catch (error) {
        console.error("Error in makeThumbnail:", error);
        next(error);
      }
    }
  },

  getPostById: async function (req, res, next) {
    const postId = req.params.id;
    const sqlStr = `select p.id, p.title, p.description, p.created_at, p.video, u.username,
     (select count(*) from likes where fk_post_id = ?) as likes
    FROM posts p
    join users u
    on u.id = p.fk_user_id
    where p.id = ?;`;
    try {
      const [rows, _] = await db.execute(sqlStr, [postId, postId]);
      const currentPost = rows[0];
      if (!currentPost) {
        req.flash("error", "Post does not exist");
        return req.session.save((err) => {
          if (err) next(err);
          return res.redirect("/");
        });
      } else {
        res.locals.currentPost = currentPost;
        next();
      }
    } catch (error) {
      next(error);
    }
  },

  getCommentsByPostId: async function (req, res, next) {
    const postId = req.params.id;
    try {
      const [comments, _] = await db.query(
        `SELECT c.id, c.text, c.created_at, u.username
       FROM comments c
       JOIN users u ON u.id = c.fk_user_id
       WHERE c.fk_post_id = ?
       ORDER BY c.created_at DESC;`,
        [postId]
      );
      res.locals.currentPost.comments = comments;
      next();
    } catch (error) {
      next(error);
    }
  },
  getRecentPost: async function (req, res, next) {
    try {
      const [posts, _] =
        await db.query(`select p.id, p.title, p.created_at, p.thumbnail, u.username
                    FROM posts p
                    join users u
                    on u.id = p.fk_user_id
                    order by p.created_at desc
                    limit 16;`);
      res.locals.posts = posts;
      next();
    } catch (error) {
      next(error);
    }
  },
  getPostByuserId: async function (req, res, next) {
    const userId = req.params.id;
  },
};
