const bcrypt = require("bcrypt");
const userSchems = require("../models/user");
const User = require("../models/user");
const { HttpError } = require("../helpers/joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function register(req, res, next) {
  const { email, password, subscription } = req.body;

  try {
    const user = await User.findOne({
      email,
      password,
      subscription,
    }).exec();

    if (!user) {
      return res
        .status(400)
        .send({ message: "Помилка від Joi або іншої бібліотеки валідації" });
    }

    if (email !== null) {
      return res.status(409).send({ message: "Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({ email, password: passwordHash });

    if (email) {
      res
        .status(201)
        .send({ user: { email: email, subscription: subscription } });
    }

    req.send({ email, password });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { email, password, subscription } = req.body;

  try {
    const token = jwt.sign({ email: User.email }, process.env.JWT_SECRET);
    const user = await User.findOne({
      email,
      password,
      subscription,
    }).exec();

    if (!user) {
      return res
        .status(400)
        .send({ message: "Помилка від Joi або іншої бібліотеки валідації" });
    }

    if (user === null) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    if (email) {
      res.status(200).send({ token: token, user: { email, subscription } });
    }

    req.send({ email: email, password: password });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  const { _id } = req.body;
  const token = jwt.sign({ email: User.email }, process.env.JWT_SECRET);

  try {
    const userId = await User.findOne({ _id }).exec();
    if (userId === null) {
      res.status(401).send({ message: "Not authorized" });
    }
    res.send(`Bearer ${{ token }}`);
    res.status(204);
  } catch (error) {
    next(error);
  }
}

async function current(req, res, next) {
  const { email, subscription } = req.body;
  const { error } = userSchems.validate(req.body);

  if (error) {
    throw HttpError(400, "Missing or invalid fields");
  }
  const token = jwt.sign({ email: User.email }, process.env.JWT_SECRET);

  try {
    if (token === null) {
      res.status(401).send({ message: "Not authorized" });
    }
    if (token) {
      res.status(200).send({ email, subscription });
    }
    res.send(`Bearer ${{ token }}`);
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, logout, current };
