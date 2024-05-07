const express = require("express");
const {
  getBlogs,
  getBlogsbyID,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../contoller/Blog");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getBlogs);
router.get("/id", getBlogsbyID);
router.post("/create", authMiddleware, createBlog);
router.post("/update", authMiddleware, updateBlog);
router.post("/delete", authMiddleware, deleteBlog);

module.exports = router;
