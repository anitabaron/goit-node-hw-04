const passport = require("passport");

const auth = (req, res, next) => {
  const middleware = passport.authenticate(
    "jwt",
    { session: false },
    (err, user) => {
      if (err || !user || user.token === null) {
        return res.status(401).json({
          status: "error",
          code: 401,
          message: "Unauthorized user",
          data: "Unauthorized user",
        });
      }
      req.user = user;
      next();
    }
  );

  middleware(req, res, next);
};

module.exports = auth;
