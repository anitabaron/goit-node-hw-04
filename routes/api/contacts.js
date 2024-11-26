const express = require("express");
const {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
} = require("../../service/contactService");
const passport = require("passport");
require("dotenv").config();

const router = express.Router();

const auth = (req, res, next) => {
  const middleware = passport.authenticate(
    "jwt",
    { session: false },
    (err, user) => {
      if (err || !user) {
        return res.status(401).json({
          status: "error",
          code: 401,
          message: "Unauthorized",
          data: "Unauthorized",
        });
      }
      req.user = user;
      next();
    }
  );

  middleware(req, res, next);
};

router.get("/", auth, async (req, res, next) => {
  try {
    const { email } = req.user;
    const contacts = await getAllContacts({ owner: req.user._id });
    if (!contacts.length) {
      return res
        .status(404)
        .json({ message: "No contacts found for this user." });
    }
    res.status(200).json({
      data: contacts,
      message: `Authorization was successful: ${email}`,
    });
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

router.post("/", auth, async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }
    const { name, email, phone, favorite } = req.body;
    const ownerId = req.user._id;
    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    const newContact = await addContact({
      name,
      email,
      phone,
      favorite,
      owner: ownerId,
    });
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
    res.status(204).json({ message: "Contact deleted" });
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
