const Contact = require("../models/schema");

const getAllContacts = async () => {
  return await Contact.find();
};

const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

const addContact = async (body) => {
  return await Contact.create(body);
};

const updateContact = async (contactId, body) => {
  return await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });
};

const removeContact = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
};
