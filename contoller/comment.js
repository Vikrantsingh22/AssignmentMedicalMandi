const DB = require("../util/SQL");
const moment = require("moment");

const getComments = (req, res) => {
  if (!req.body.postid) {
    return res.status(400).json({ message: "postid is required" });
  }
  const query =
    "SELECT c.*,username,email FROM comments AS c JOIN users AS u ON c.userid = u.id WHERE c.postid = ? ";
  DB.query(query, [req.body.postid], (err, result) => {
    if (err) return res.status(500).json({ message: err });
    res.status(200).json(result);
  });
};

const createComment = (req, res) => {
  if (!req.body.comment || !req.body.postid) {
    return res.status(400).json({ message: "comment,postid is required" });
  }
  const query =
    "INSERT INTO comments (`description`,`postid`,`userid`,`Date`) VALUES (?)";
  const v = [
    req.body.comment,
    req.body.postid,
    req.user.id,
    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
  ];
  DB.query(query, [v], (err, result) => {
    if (err) return res.status(500).json({ message: err });
    res.status(201).json({ message: "Comment created", data: result });
  });
};

const updateCommentByID = (req, res) => {
  if (!req.body.comment || !req.body.id) {
    return res.status(400).json({ message: "comment and id is required" });
  }
  const commentID = req.body.id;
  const query =
    "UPDATE comments SET description = ? WHERE id = ? AND userid = ?";
  const v = [req.body.comment, commentID, req.user.id];
  DB.query(query, v, (err, result) => {
    if (err) return res.status(500).json({ message: err });
    res.status(200).json({ message: result.info });
  });
};

const deleteCommentByID = (req, res) => {
  if (!req.body.id) {
    return res.status(400).json({ message: "id is required" });
  }
  const query = "DELETE FROM comments WHERE id = ? AND userid = ?";
  DB.query(query, [req.body.id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: err });
    res
      .status(200)
      .json({ message: "updated rows are " + result.affectedRows });
  });
};

module.exports = {
  getComments,
  createComment,
  updateCommentByID,
  deleteCommentByID,
};
