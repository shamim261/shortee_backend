const express = require("express");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const { signup, login } = "../controller/usersController";
const { jwtTokenGen } = require("../utilities/util");

const User = require("../models/usersSchema");
const {
  userValidator,
  userValidatorHandler,
} = require("../middlewares/common/userValidator");

const router = express.Router();

// signup users
router.post(
  "/signup",
  userValidator,
  userValidatorHandler,
  async function signup(req, res, next) {
    let newUser;
    let hashedPassword = await bcrypt.hash(req.body.password, 10);

    newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    try {
      const user = await newUser.save();

      const userObj = {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      };
      const token = jwtTokenGen(userObj);
      
      res.send({
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        token: token
      });
    } catch (e) {
      res.status(500).send({
        message: "Something wentt wrong!",
      });
    }
  }
);

// login

router.post("/", async function login(req, res, next) {
  try {
    const user = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.username }],
    });

    if (user && user._id) {
      let isValidPass = await bcrypt.compare(req.body.password, user.password);
      if (isValidPass) {
        const userObj = {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
        };
        const token = jwtTokenGen(userObj);
       
        res.send({
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          token: token
        });
      }
    } else {
      res.send({
        message: "Wrong Username/Email or Password!",
      });
    }
  } catch (err) {
    res.send({
      
      message: "Something went wrong!",
    });
  }
});

// logout



module.exports = router;
