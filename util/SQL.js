const mysql = require("mysql2");

require("dotenv").config();
const DB = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

module.exports = DB;
