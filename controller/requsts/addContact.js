const Contact = require("../../models/contacts");
const { schema, HttpError, ctrlWrapper } = require("../../models/joi");

const addContact = async (req, res) => {
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
};

module.exports = { addContact: ctrlWrapper(addContact) };
