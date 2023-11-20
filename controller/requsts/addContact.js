const Joi = require("joi");
const { HttpError, ctrlWrapper } = require("../../helpers");
const Contact = require("../../models/contacts");

const addContact = async (req, res) => {
  const contactNew = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
  };

  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).max(15).required(),
    favorite: Joi.boolean(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    throw HttpError(400, "Missing or invalid required fields");
  }

  const newContact = await Contact.create(contactNew);

  res.status(201).json(newContact);
};

module.exports = { addContact: ctrlWrapper(addContact) };
