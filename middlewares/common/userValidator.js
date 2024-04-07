const { check, validationResult } = require("express-validator");
const createError = require("http-errors");

const User = require("../../models/usersSchema");

const userValidator = [
  check("username")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name must not contain anything other than alphabet")
    .custom(async (value) => {
      try {
        const user = await User.findOne({ username: value });
        if (user) {
          throw createError("Username already exist!");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("email")
    .isEmail()
    .withMessage("Invalid Email Address!")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          throw createError("Email already exist!");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
];

const userValidatorHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    console.log(mappedErrors);
    res.status(200).send({ errors: mappedErrors });
  }
};

module.exports = {
  userValidator,
  userValidatorHandler,
};
