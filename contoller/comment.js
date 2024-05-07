const DB = require("../util/SQL");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const getComments = (req, res) => {
  const query =
    "SELECT c.*,username,email FROM comments AS c JOIN users AS u ON c.userid = u.id WHERE c.postid = ? ";
  DB.query(query, [req.body.postid], (err, result) => {
    if (err) return res.status(500).json({ message: err });
    res.status(200).json(result);
  });
};

const createComment = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(token, "secret", (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    const query =
      "INSERT INTO comments (`description`,`postid`,`userid`,`Date`) VALUES (?)";
    const v = [
      req.body.comment,
      req.body.postid,
      user.id,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];
    DB.query(query, [v], (err, result) => {
      if (err) return res.status(500).json({ message: err });
      res.status(201).json({ message: "Comment created", data: result });
    });
  });
};

const updateCommentByID = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(token, "secret", (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    const commentID = req.body.id;
    const query =
      "UPDATE comments SET description = ? WHERE id = ? AND userid = ?";
    const v = [req.body.comment, commentID, user.id];
    DB.query(query, v, (err, result) => {
      if (err) return res.status(500).json({ message: err });
      res.status(200).json({ message: "Comment updated" });
    });
  });
};

const deleteCommentByID = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(token, "secret", (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    const query = "DELETE FROM comments WHERE id = ? AND userid = ?";
    DB.query(query, [req.body.id, user.id], (err, result) => {
      if (err) return res.status(500).json({ message: err });
      res.status(200).json({ message: "Comment deleted" });
    });
  });
};

module.exports = {
  getComments,
  createComment,
  updateCommentByID,
  deleteCommentByID,
};
