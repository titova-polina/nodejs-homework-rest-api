const express = require("express");

const router = express.Router();

const authRoutes = require("./auth");
const contactsRoutes = require("./contacts");

router.use("/auth", authRoutes);
router.use("/contacts", contactsRoutes);

module.exports = router;
