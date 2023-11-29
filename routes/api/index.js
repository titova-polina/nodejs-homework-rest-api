const express = require("express");
const router = express.Router();
const ctrlContact = require("");
const checkBody = require("../../controller/requsts/requests");

router.get("/", ctrlContact.listContacts);
router.get("/:contactId", ctrlContact.getContactById);
router.post("/", ctrlContact.addContact);
router.put("/:contactId", ctrlContact.updateContact);
router.patch("/:contactId/favorite", ctrlContact.updateStatus, checkBody);
router.delete("/:contactId", ctrlContact.removeContact);

module.exports = router;
