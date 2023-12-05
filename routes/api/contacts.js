const express = require("express");
const router = express.Router();
const ctrlContact = require("../../controller/contacts");
const { auth } = require("../../helpers/passport-jwt");

router.get("/", auth, ctrlContact.listContacts);
router.get("/:contactId", auth, ctrlContact.getContactById);
router.post("/", auth, ctrlContact.addContact);
router.put("/:contactId", auth, ctrlContact.updateContact);
router.patch("/:contactId/favorite", auth, ctrlContact.updateStatus);
router.delete("/:contactId", auth, ctrlContact.removeContact);

module.exports = router;
