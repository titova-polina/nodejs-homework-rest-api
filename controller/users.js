const User = require("../models/user");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const { normalizeImage } = require("../helpers/jimp");

async function register(req, res, next) {
  const { email, password, subscription } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).send({ message: "Email in use" });
    }

    const user = new User({
      subscription,
      email,
      gravatar: gravatar.url(email, {}, "http"),
    });
    user.setPassword(password);
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(201).send({
      token,
      user: {
        email: email,
        subscription: subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      email,
    });

    const verified = await user.verifyPassword(password);

    if (!user || !verified) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res
      .status(200)
      .send({ token, user: { email, subscription: user.subscription } });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  res.status(204).send();
}

async function current(req, res, next) {
  const user = req.user;

  res.status(200).send({ user });
}

async function uploadAvatar(req, res, next) {
  try {
    await normalizeImage(req.file);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: req.file.filename },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, logout, current, uploadAvatar };
