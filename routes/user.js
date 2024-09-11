const express = require("express");
const router = express.Router();
const User = require("../model/user");
const bcrypt = require("bcryptjs");

const saltRounds = 10; // Number of salt rounds for hashing passwords

// Register a new user
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Authenticate a user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({ message: user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
