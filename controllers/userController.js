const User = require("../models/user");
//FOR GENERATING TOKEN
const generateToken = require("../utils/generateToken");
//BCRYPT
const { genSalt, compare, hash } = require("bcrypt");

module.exports = {
  signup: async (req, res) => {
    const { username, password } = req.body;
    try {
      User.findOne({
        username,
      }).exec(async (err, user) => {
        if (user) {
          return res.status(400).json({
            message: "User with this username already exists",
          });
        }

        const salt = await genSalt();
        const passwordHash = await hash(password, salt);

        const newUser = new User({
          username,
          password: passwordHash,
        });

        newUser.save((err, success) => {
          if (err) {
            console.log(err);
            return res.status(400).json({
              message: "User registration failed, Try again!",
            });
          }
          res.status(201).json({
            username: success.username,
            token: generateToken(success._id),
          });
        });
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  },

  signin: (req, res) => {
    const { username, password } = req.body;
    User.findOne({
      username,
    }).exec(async (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          message: "User does not exist",
        });
      }
      const validPassword = await compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({
          message: "Incorrect username or password.",
        });
      }
      res.status(201).json({
        username: user.username,
        token: generateToken(user._id),
      });
    });
  },
};
