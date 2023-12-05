const express = require("express");
const UsersController = require("../../controller/users");
const { auth } = require("../../helpers/passport-jwt");
const router = express.Router();

router.post("/register", UsersController.register);
router.post("/login", UsersController.login);
router.post("/logout", auth, UsersController.logout);
router.get("/current", auth, UsersController.current);

module.exports = router;
