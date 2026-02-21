const User = require("../Models/User");
const bcrypt = require("bcrypt");
const createUser = async (req, res) => {
  try {
    //get data
    const { username, email, password, role } = req.body;
    // validate data
    if (!username || !email || !password) {
      return res.status(400).json({ msg: "missed data" });
    }
    const exitUser = await User.findOne({ email });
    if (exitUser) {
      return res.status(400).json({ msg: "account already exist" });
    }
    //create user
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashPassword,
      role,
    });
    res.status(201).json({
      success: true,
      msg: "Done created user",
      data: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: err.message,
    });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "missing email or password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }
    // const authCode = Buffer.from(user._id.toString()).toString("base64");

    res.json({
      success: true,
      msg: "Login successful",
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: err.message,
    });
  }
};
const userGet = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      res.status(404).json({ msg: "users not found" });
    }
    const count = await User.countDocuments();
    res.status(201).json({
      success: true,
      msg: "users fetched successfully",
      totalUsers: count,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: err.message,
    });
  }
};
module.exports = {
  createUser,
  userLogin,
  userGet,
};
