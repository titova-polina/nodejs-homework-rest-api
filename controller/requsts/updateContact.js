const Joi = require("joi");
const mongoose = require("mongoose");
const { HttpError, ctrlWrapper } = require("../../helpers");
const Contact = require("../../models/contacts");

const updateContact = async (req, res) => {
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

  const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string().min(10).max(15),
    favorite: Joi.boolean(),
  });

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
};

module.exports = { updateContact: ctrlWrapper(updateContact) };
