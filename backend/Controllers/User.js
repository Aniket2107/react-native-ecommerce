const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");

exports.getAllUser = async (req, res) => {
  const userList = await User.find().select("-password");

  if (!userList)
    return res.status(500).json({ success: false, msg: "No user(s) found" });

  return res.status(200).json({ success: true, data: userList });
};

exports.getUsersCount = async (req, res) => {
  const userCount = await User.countDocuments((count) => count);

  if (!userCount)
    return res.status(500).json({ success: false, msg: "No users found" });

  return res.status(200).json({ success: true, data: userCount });
};

exports.getAUser = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user)
    return res.status(500).json({ success: false, msg: "No user found" });

  return res.status(200).json({ success: true, data: user });
};

exports.register = async (req, res) => {
  //Validations
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, msg: errors.array()[0].msg });

  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    return res
      .status(400)
      .json({ success: false, msg: "Email already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPass,
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
  });

  newUser.save((err, user) => {
    if (err) return res.status(400).json({ success: false, msg: err });

    res.status(200).json({ success: true, msg: "User registeration success" });
  });
};

exports.login = async (req, res) => {
  //Validation
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, msg: errors.array()[0].msg });

  //Check for email in Db
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).json({ success: false, msg: "User not found" });

  //Check for password
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res
      .status(403)
      .json({ success: false, msg: "Email and Password does not match" });

  const token = jwt.sign(
    { userId: user.id, isAdmin: user.isAdmin },
    process.env.SECRET_KEY,
    { expiresIn: "1d" }
  );
  res
    .status(200)
    .json({ success: true, msg: "Login success", data: { token: token } });
};
