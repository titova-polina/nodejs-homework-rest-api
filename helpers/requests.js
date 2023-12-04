const { contacts } = require("../controller/contacts.js");
const Joi = require("joi");
const { HttpError } = require("../models/joi.js");

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
  contacts,
  checkBody,
};
