const express = require("express");
const {
  getComments,
  createComment,
  updateCommentByID,
  deleteCommentByID,
} = require("../contoller/comment");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/list", getComments);
router.post("/create", authMiddleware, createComment);
router.post("/update", authMiddleware, updateCommentByID);
router.post("/delete", authMiddleware, deleteCommentByID);

module.exports = router;
