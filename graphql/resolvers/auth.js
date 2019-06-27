const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const { transformUser } = require("./utils");

module.exports = {
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email: email });

      if (!user) {
        throw new Error("User does not exist!");
      }

      const isEqual = await bcrypt.compare(password, user._doc.password);

      if (!isEqual) {
        throw new Error("Password is not correct!");
      }
      // TODO: CHANGE KEY
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        "SECRET_KEY",
        {
          expiresIn: "1h"
        }
      );

      return {
        userId: user.id,
        token,
        tokenExp: 1
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  users: async () => {
    try {
      const results = await User.find();
      return results.map((user) => transformUser(user));
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  createUser: async ({ userInput }) => {
    try {
      const existUser = await User.findOne({ email: userInput.email });

      if (existUser) throw new Error("User is exists!");

      const hashedPassword = await bcrypt.hash(userInput.password, 12);

      const user = new User({
        email: userInput.email,
        password: hashedPassword
      });

      const result = await user.save();

      return { ...result._doc, password: null };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
