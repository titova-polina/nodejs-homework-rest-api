const Contact = require("../models/contacts");
const schema = require("../models/contacts");
const { HttpError } = require("../helpers/joi");
const mongoose = require("mongoose");

async function addContact(req, res, next) {
  const contactNew = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
  };

  const { error } = schema.validate(req.body);

  if (error) {
    throw HttpError(400, "Missing or invalid required fields");
  }

  const newContact = await Contact.create(contactNew);

  res.status(201).json(newContact);
}

async function getContactById(req, res, next) {
  const id = req.params.contactId;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw HttpError(400, "Invalid Id");
  }
  const contactOn = await Contact.findById(id);
  if (contactOn) {
    return res.status(200).send(contactOn);
  }
  throw HttpError(404, "Not found");
}

async function listContacts(req, res, next) {
  const contacts = await Contact.find().exec();
  res.status(200).json(contacts);
}

async function removeContact(req, res, next) {
  const id = req.params.contactId;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw HttpError(400, "Invalid Id");
  }
  const result = await Contact.findByIdAndDelete(id);
  if (result === null) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({ message: "contact deleted" });
}

async function updateContact(req, res, next) {
  const id = req.params.contactId;
  const contactNew = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
  };

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw HttpError(400, "Invalid Id");
  }

  const { error } = schema.validate(req.body);

  if (error) {
    throw HttpError(400, "Missing or invalid fields");
  }

  const newContact = await Contact.findByIdAndUpdate(id, contactNew, {
    new: true,
  });

  if (!newContact) {
    throw HttpError(404, "Not found");
  }

  res.status(201).send(newContact);
}

async function updateStatus(req, res, next) {
  const id = req.params.contactId;
  const contactNew = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: !req.body.favorite,
  };

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw HttpError(400, "Invalid Id");
  }

  const newContact = await Contact.findByIdAndUpdate(id, contactNew, {
    new: true,
  });

  if (!newContact) {
    throw HttpError(404, "Not found");
  }

  res.status(200).send(newContact);
}

module.exports = {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContact,
  updateStatus,
};
