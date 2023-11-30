const bcrypt = require("bcrypt");

const User = require("../models/schemas/user");

async function register(req, res, next) {
  const { email, password, subscription } = req.body;

  try {
    const user = await User.findOne({ email }).exec();
    if (user === null) {
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
      res.status(201).send({ user: { email, subscription } });
    }

    req.send({ email, password });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { email, password, token, subscription } = req.body;

  try {
    const user = await User.findOne({ email }).exec();
    if (user === null) {
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
      res.status(200).send({ token, user: { email, subscription } });
    }

    req.send({ email, password });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  const { _id } = req.body;

  try {
    const userId = await User.findOne({ _id }).exec();
    if (userId === null) {
      res.status(401).send({ message: "Not authorized" });
    }
    res.send("Bearer {{token}}");
    res.status(204);
  } catch (error) {
    next(error);
  }
}

async function current(req, res, next) {
  const { email, subscription, token } = req.body;

  try {
    if (token === null) {
      res.status(401).send({ message: "Not authorized" });
    }
    if (token) {
      res.status(200).send({ email, subscription });
    }
    res.send("Bearer {{token}}");
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, logout, current };
