const DB = require("../util/SQL");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const getBlogs = (req, res) => {
  const query =
    "SELECT b.*,username,email FROM blogpost AS b JOIN users AS u ON b.uid = u.id ORDER BY b.date DESC";
  DB.query(query, (err, result) => {
    if (err) return res.status(500).json({ message: err });
    res.status(200).json(result);
  });
};

const createBlog = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, "secret", (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    console.log(user);
    const query =
      "INSERT INTO blogpost (`title`, `desc`,`img`,`uid`,`date`) VALUES (?)";
    const v = [
      req.body.title,
      req.body.desc,
      req.body.img,
      user.id,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];
    DB.query(query, [v], (err, result) => {
      if (err) return res.status(500).json({ message: err });
      res
        .status(201)
        .json({ message: "Blog created", BlogID: result.insertId });
    });
  });
};

const getBlogsbyID = (req, res) => {
  const query =
    "SELECT b.*,username,email FROM blogpost AS b JOIN users AS u ON b.uid = u.id WHERE b.id = ? ";
  DB.query(query, [req.body.id], (err, result) => {
    if (err) return res.status(500).json({ message: err });
    res.status(200).json(result);
  });
};

const updateBlog = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secret", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.body.id;
    const q =
      "UPDATE blogpost SET `title`=?,`desc`=?,`img`=? WHERE `id` = ? AND `uid` = ?";

    const values = [req.body.title, req.body.desc, req.body.img];

    DB.query(q, [...values, postId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Blog has been updated.");
    });
  });
};

const deleteBlog = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(token, "secret", (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    const blogID = req.body.id;
    const query = "DELETE FROM blogpost WHERE id = ? AND uid = ?";
    DB.query(query, [blogID, user.id], (err, result) => {
      if (err) return res.status(500).json({ message: err });
      res.status(200).json({ message: "Blog deleted" });
    });
  });
};

module.exports = { getBlogs, createBlog, getBlogsbyID, updateBlog, deleteBlog };
