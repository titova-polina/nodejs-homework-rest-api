const express = require("express");
const Joi = require("joi");
const contactSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.number().required(),
});
const {
  listContacts,
  addContact,
  getContactById,
  removeContact,
  updateContact,
} = require("../../models/contacts");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  res.status(200).json({ message: "Successfully got contacts", contacts });
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (contact) {
    res.status(200).json({ message: "Successfully got id", contact });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

router.post("/", async (req, res, next) => {
  contactSchema.validate(req.body);
  const contact = await addContact(req.body);
  if (contact) {
    res.status(201).json({ message: "Successfully add contact", contact });
  } else {
    res.status(400).json({ message: "missing required name field" });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await removeContact(contactId);
  if (contact) {
    res.status(200).json({ message: "contact deleted", contact });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

router.put("/:contactId", async (req, res, next) => {
  contactSchema.validate(req.body);
  const body = req.body;
  const { contactId } = req.params;
  const contact = await updateContact(contactId, body);
  if (contact) {
    res.status(200).json({ message: "Successfully update contacts", contact });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

module.exports = router;
