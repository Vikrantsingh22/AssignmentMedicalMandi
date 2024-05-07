const express = require("express");
const app = express();
const port = 3000;
const blogRouter = require("./routes/Blog");
const userRouter = require("./routes/user");
const commentRouter = require("./routes/comment");
const cookieParser = require("cookie-parser");
require("dotenv").config();
// dbConnect();
app.use(express.json());
app.use(cookieParser());
app.use("/user", userRouter);
app.use("/blog", blogRouter);
app.use("/comment", commentRouter);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
