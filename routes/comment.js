const express = require("express");
const {
  getComments,
  createComment,
  updateCommentByID,
  deleteCommentByID,
} = require("../contoller/comment");
const router = express.Router();

router.post("/list", getComments);
router.post("/create", createComment);
router.post("/update", updateCommentByID);
router.post("/delete", deleteCommentByID);

module.exports = router;
