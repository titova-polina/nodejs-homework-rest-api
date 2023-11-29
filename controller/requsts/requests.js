const { getAll } = require("./listContacts.js");
const { getById } = require("./getContactById.js");
const { postContact } = require("./addContact.js");
const { deleteById } = require("./removeContact.js");
const { putById } = require("./updateContact.js");
const { updateStatusContact } = require("./updateStatusContact");
const Joi = require("joi");
const { HttpError } = require("../../models/joi.js");

const contactUpdate = (data) => {
  const contactSchema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.number().required(),
  });

  return contactSchema.validate(data);
};

const checkBody = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(HttpError(400, "Missing field favorite"));
  }
  const { error } = contactUpdate(req.body);
  if (error) {
    throw HttpError(400, "missing fields");
  }

  next();
};

module.exports = {
  getAll,
  getById,
  postContact,
  deleteById,
  putById,
  updateStatusContact,
  checkBody,
};
