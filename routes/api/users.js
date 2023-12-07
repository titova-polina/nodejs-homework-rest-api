const express = require("express");
const UsersController = require("../../controller/users");
const { auth } = require("../../helpers/passport-jwt");
const router = express.Router();
const { upload } = require("../../middleware/upload");

router.post("/register", UsersController.register);
router.post("/login", UsersController.login);
router.post("/logout", auth, UsersController.logout);
router.get("/current", auth, UsersController.current);
router.patch(
  "/avatar",
  upload.single("avatar"),
  auth,
  UsersController.uploadAvatar
);

module.exports = router;
