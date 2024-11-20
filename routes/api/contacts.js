// const Joi = require("joi");
const express = require("express");
const {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
} = require("../../service/contactService");

// const schema = Joi.object({
//   name: Joi.string()
//     .pattern(/^[a-zA-Z]+( [a-zA-Z]+)*$/)
//     .min(2)
//     .max(40)
//     .required(),
//   email: Joi.string()
//     .email({
//       minDomainSegments: 2,
//       tlds: { allow: ["com", "net", "pl"] },
//     })
//     .required(),
//   phone: Joi.number().integer().required(),
// favorite: Joi.boolean()
// });

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contacts = await getAllContacts();
    if (!contacts.length) {
      return res.status(404).json({ message: "No contacts found." });
    }
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const id = req.params.contactId;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid contact ID format." });
    }
    const contact = await getContactById(id);
    if (!contact) {
      return res.status(404).json({
        message: "Contact not found.",
      });
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone, favorite } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    const newContact = await addContact({ name, email, phone, favorite });
    res.status(201).json({
      message: "Contact created",
      contact: newContact,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const id = req.params.contactId;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid contact ID format." });
    }
    if (!id) {
      res.status(404).json({ message: "Id is required to delete contact" });
    }
    const deletedContact = await removeContact(id);
    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found." });
    }
    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const { name, email, phone, favorite } = req.body;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid contact ID format." });
    }
    if (!name || !email || !phone) {
      return res.status(400).json({
        message: "Missing required fields.",
      });
    }
    const updatedContact = await updateContact(id, {
      name,
      email,
      phone,
      favorite,
    });
    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found." });
    }
    res.status(200).json({
      message: "Contact updated",
      contact: updatedContact,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  try {
    const id = req.params.contactId;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid contact ID format." });
    }
    const { favorite } = req.body;
    if (favorite === undefined) {
      return res.status(400).json({ message: "Missing field favorite" });
    }
    const updatedContact = await updateContact(id, {
      favorite,
    });
    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json({
      message: "Contact updated",
      contact: updatedContact,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
