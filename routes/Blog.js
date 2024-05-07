const express = require("express");
const {
  getBlogs,
  getBlogsbyID,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../contoller/Blog");
const router = express.Router();

router.get("/", getBlogs);
router.get("/id", getBlogsbyID);
router.post("/create", createBlog);
router.post("/update", updateBlog);
router.post("/delete", deleteBlog);

module.exports = router;
