const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const User = require("../models/schemaUser");
require("dotenv").config();

const secret = process.env.AUTH_SECRET;

const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new JwtStrategy(params, async function (payload, done) {
    console.log("Payload JWT:", payload);
    try {
      const user = await User.findById(payload.id);
      if (!user) {
        console.log("User not found");
        return done(null, false);
      }
      console.log("User found:", user);
      return done(null, user);
    } catch (err) {
      console.error("Error in JWT strategy:", err);
      return done(err, false);
    }
  })
);
