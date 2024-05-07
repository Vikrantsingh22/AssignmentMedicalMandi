const DB = require("../util/SQL");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = (req, res) => {
  if (!req.body.username || !req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ message: "username, email and password are mandatory" });
  }
  const query = "SELECT * FROM users WHERE email = ? OR username =?";
  DB.query(query, [req.body.email, req.body.username], (err, result) => {
    if (err) return res.status(500).json({ message: err });
    if (result.length > 0)
      return res.status(400).json({ message: "Email already exists" });

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    const query =
      "INSERT INTO users (`username`, `email`, `password`) VALUES (?)";
    const v = [req.body.username, req.body.email, hashedPassword];
    DB.query(query, [v], (err, result) => {
      if (err) return res.status(500).json({ message: err });
      res.status(201).json({ message: "User created" });
    });
  });
};

const login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ message: "email and password are mandatory" });
  }
  const query = "SELECT * FROM users WHERE email = ?";
  DB.query(query, [req.body.email], (err, result) => {
    if (err) return res.status(500).json({ message: err });
    if (result.length === 0)
      return res.status(400).json({ message: "Email not found" });

    const user = result[0];
    console.log(user);
    const isPasswordValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid password" });
    const { username, email } = user;
    const token = jwt.sign({ id: user.ID }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res
      .cookie("token", token, { httpOnly: true })
      .status(200)
      .json({ username, email });
  });
};

const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logged out" });
};

module.exports = { register, login, logout };
