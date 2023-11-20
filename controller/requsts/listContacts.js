const Contact = require("../../models/schemas/schema");
const { ctrlWrapper } = require("../index");

const listContacts = async (req, res) => {
  const contacts = await Contact.find().exec();
  res.status(200).json(contacts);
};
module.exports = { listContacts: ctrlWrapper(listContacts) };
