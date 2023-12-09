const User = require("../models/user");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const { normalizeImage } = require("../helpers/jimp");
const { sendVerificationEmail } = require("../helpers/nodemailer");
const { v4: uuidv4 } = require("uuid");

async function register(req, res, next) {
  const { email, password, subscription } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).send({ message: "Email in use" });
    }

    const verificationToken = uuidv4();

    const emailSent = await sendVerificationEmail(email, verificationToken);

    if (!emailSent) {
      return res.status(404).send({
        message:
          "We vere not able to send you email. Check the address you entered and try again",
      });
    }

    const user = new User({
      subscription,
      email,
      gravatar: gravatar.url(email, {}, "http"),
      verificationToken,
    });
    user.setPassword(password);
    await user.save();

    res.status(201).send({
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

    if (user && !user.verified) {
      return res.status(400).send({ message: "Email is not verified" });
    }

    const isRightPassword = await user.verifyPassword(password);

    if (!user || !isRightPassword) {
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

async function verify(req, res, next) {
  const { verificationToken } = req.params;

  try {
    const existingUser = await User.findOne({ verificationToken });

    console.log("existingUser", existingUser);

    if (!existingUser) {
      return res.status(404).send({ message: "Verification not found" });
    }

    existingUser.verified = true;
    existingUser.verificationToken = null;
    await existingUser.save();

    res.status(200).send({
      user: existingUser,
    });
  } catch (error) {
    next(error);
  }
}

async function reVerify(req, res, next) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send({ message: "missing required field email" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).send({ message: "User not found" });
    }

    if (existingUser.verified) {
      return res
        .status(400)
        .send({ message: "Verification has already been passed" });
    }

    const verificationToken = uuidv4();
    const emailSent = await sendVerificationEmail(email, verificationToken);

    if (!emailSent) {
      return res.status(404).send({
        message:
          "We vere not able to send you email. Check the address you entered and try again",
      });
    }

    res.status(200).send({ message: "Resend email varification" });

    const user = new User({
      email,
      verificationToken,
    });
    await user.save();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
  current,
  uploadAvatar,
  verify,
  reVerify,
};
