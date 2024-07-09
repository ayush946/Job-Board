const passport = require("passport");

const jwtAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json(info);
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = jwtAuth;
