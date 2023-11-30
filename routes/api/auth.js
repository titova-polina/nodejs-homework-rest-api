const express = require("express");

const AuthController = require("../../controller/auth");

const router = express.Router();
const jsonParser = express.json();

router.post("/register", jsonParser, AuthController.register);
router.post("/login", jsonParser, AuthController.login);
router.post("/logout", jsonParser, AuthController.logout);
router.get("/current", jsonParser, AuthController.current);

module.exports = router;
