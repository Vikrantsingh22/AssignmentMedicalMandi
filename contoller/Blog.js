const DB = require("../util/SQL");
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
  if (!req.body.title || !req.body.desc || !req.body.img) {
    return res
      .status(400)
      .json({ message: "title, desc and img are mandatory" });
  }
  const query =
    "INSERT INTO blogpost (`title`, `desc`,`img`,`uid`,`date`) VALUES (?)";
  const v = [
    req.body.title,
    req.body.desc,
    req.body.img,
    req.user.id,
    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
  ];
  DB.query(query, [v], (err, result) => {
    if (err) return res.status(500).json({ message: err });
    res.status(201).json({ message: "Blog created", BlogID: result.insertId });
  });
};

const getBlogsbyID = (req, res) => {
  if (!req.body.id) {
    return res.status(400).json({ message: "id is required" });
  }
  const query =
    "SELECT b.*,username,email FROM blogpost AS b JOIN users AS u ON b.uid = u.id WHERE b.id = ? ";
  DB.query(query, [req.body.id], (err, result) => {
    if (err) return res.status(500).json({ message: err });
    res.status(200).json(result);
  });
};

const updateBlog = (req, res) => {
  if (!req.body.title || !req.body.desc || !req.body.img || !req.body.id) {
    return res
      .status(400)
      .json({ message: "title, desc ,id  and img are mandatory" });
  }
  const postId = req.body.id;
  const q =
    "UPDATE blogpost SET `title`=?,`desc`=?,`img`=? WHERE `id` = ? AND `uid` = ?";

  const values = [req.body.title, req.body.desc, req.body.img];

  DB.query(q, [...values, postId, req.user.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: data.info });
  });
};

const deleteBlog = (req, res) => {
  if (!req.body.id) {
    return res.status(400).json({ message: "id is required" });
  }
  const blogID = req.body.id;
  const query = "DELETE FROM blogpost WHERE id = ? AND uid = ?";
  DB.query(query, [blogID, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: err });
    res.status(200).json({ message: result });
  });
};

module.exports = { getBlogs, createBlog, getBlogsbyID, updateBlog, deleteBlog };
