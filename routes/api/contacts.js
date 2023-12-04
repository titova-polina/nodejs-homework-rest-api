const express = require("express");
const router = express.Router();
const ctrlContact = require("../../controller/contacts");
const { auth } = require("../../helpers/passport-jwt");

router.get("/", auth, ctrlContact.listContacts);
router.get("/:contactId", ctrlContact.getContactById);
router.post("/", ctrlContact.addContact);
router.put("/:contactId", ctrlContact.updateContact);
router.patch("/:contactId/favorite", ctrlContact.updateStatus);
router.delete("/:contactId", ctrlContact.removeContact);

module.exports = router;
