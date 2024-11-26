const express = require("express");
const User = require("../../models/schemaUser");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const secret = process.env.AUTH_SECRET;

const router = express.Router();

// zrobić błąd walidacji na poziomie wpisywania Joi, na poziomie bazy mongoose(zgodnie ze Schema)
router.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).lean();
  if (user) {
    return res.status(409).json({ message: "This email is already in use." });
  }

  try {
    const newUser = new User({ email });
    await newUser.setPassword(password);
    await newUser.save();
    return res
      .status(201)
      .json({ message: `Registration succesful for ${email}` });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isPasswordCorrect = await user.validatePassword(password);
    if (!user) {
      return res.status(401).json({ message: "No such user" });
    }
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Email or password is wrong!" });
    }
    if (isPasswordCorrect) {
      const payload = {
        id: user._id,
        email: user.email,
      };
      const token = jwt.sign(payload, secret, { expiresIn: "1h" });
      return res.status(200).json({
        message: `Login succesful for ${email}`,
        data: { token },
      });
    }
  } catch (error) {
    next(error);
  }
});

// dostanie się do listy contaktów ?
// router.get("/list", auth, (req, res, next) => {
//   const { email } = req.user;
//   res.json({
//     status: "success",
//     code: 200,
//     data: {
//       message: `Authorization was successful: ${email}`,
//     },
//   });
// });

router.get("/logout", async (req, res, next) => {});
router.get("/current", async (req, res, next) => {});

module.exports = router;
