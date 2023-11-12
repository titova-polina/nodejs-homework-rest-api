const fs = require("fs/promises");
const path = require("path");

const contactsPath = path.join(__dirname, "./contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf-8");
  const contacts = JSON.parse(data);
  return contacts;
};

const getContactById = async (contactId) => {
  const data = await fs.readFile(contactsPath, "utf-8");
  const contacts = JSON.parse(data);
  const contact = contacts.find((c) => c.id === contactId);
  return contact || null;
};

const removeContact = async (contactId) => {
  const data = await fs.readFile(contactsPath, "utf-8");
  const contacts = JSON.parse(data);
  const contactIndex = contacts.findIndex((c) => c.id === contactId);
  if (contactIndex === -1) {
    return null;
  }
  const removedContact = contacts.splice(contactIndex, 1)[0];
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return removedContact;
};

const addContact = async (body) => {
  const data = await fs.readFile(contactsPath, "utf-8");
  const contacts = JSON.parse(data);
  const newContact = { id: Date.now().toString(), ...body };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const data = await fs.readFile(contactsPath, "utf-8");
  const contacts = JSON.parse(data);
  const contactIndex = contacts.findIndex(({ id }) => id === contactId);
  if (contactIndex === -1) {
    return null;
  }
  contacts[contactIndex] = { ...contacts[contactIndex], ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[contactIndex];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
