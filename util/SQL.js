const mysql = require("mysql2");

const DB = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "blog",
});

module.exports = DB;
