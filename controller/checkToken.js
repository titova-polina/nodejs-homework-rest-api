const jwt = require("jsonwebtoken");

const secretKey = "yourSecretKey";

const checkTokenMiddleware = (req, res, next) => {
  const { user, token } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  jwt.verify(token, secretKey, async (err) => {
    if (err) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!user || token !== user.token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;
    next();
  });
};

module.exports = checkTokenMiddleware;
