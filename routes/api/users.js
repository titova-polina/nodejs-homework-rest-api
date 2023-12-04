const express = require("express");
const UsersController = require("../../controller/users");
const { auth } = require("../../helpers/passport-jwt");
const router = express.Router();
const jsonParser = express.json();

router.post("/register", jsonParser, UsersController.register);
router.post("/login", jsonParser, UsersController.login);
router.post("/logout", jsonParser, auth, UsersController.logout);
router.get("/current", jsonParser, auth, UsersController.current);

module.exports = router;
