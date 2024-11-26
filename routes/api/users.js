const express = require("express");
const User = require("../../models/schemaUser");
require("dotenv").config();
const jwt = require("jsonwebtoken");
// const passport = require("passport");
// const passportJWT = require('passport-jwt')

const secret = process.env.AUTH_SECRET;

const router = express.Router();

// const ExtractJWT = passportJWT.ExtractJwt
// const Strategy = passportJWT.Strategy
// const params = {}

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

router.post(
  "/login",
  // auth,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).lean();
      if (!user) {
        return res.status(401).json({ message: "No such user" });
      }
      const isPasswordCorrect = await User.validatePassword(password);
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
      } else {
        return res.status(401).json({ message: "Wrong password!" });
      }
    } catch (error) {
      next(error);
    }

    // const auth =
    //   (req,
    //   res,
    //   (next) => {
    //     passport.authenticate("jwt", { session: false }, (error, user) => {
    //       if (user || error) {
    //         res.status(401).json({ message: "Email or password is wrong" });
    //       }
    //       req.user = user;
    //       next();
    //     })(req, res, next);
    //   });
  }
);

router.get("/logout", async (req, res, next) => {});
router.get("/current", async (req, res, next) => {});

module.exports = router;
