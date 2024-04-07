const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/usersSchema");

// Signup User

const signup = asyncHandler(async (req, res, next) => {
  let newUser;
  let hashedPassword = await bcrypt.hash(req.body.password, 10);

  newUser = new User({
    ...req.body,
    password: hashedPassword,
  });

  const user = await newUser.save();

  res.status(200).json({
    message: "User created successfully!",
  });
});

// login Handler

module.exports = { signup, login };
