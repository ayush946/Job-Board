const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { Strategy: JWTStrategy, ExtractJwt } = require("passport-jwt");
const User = require("../models/User");
const authKeys = require("./authKeys");

const filterJson = (obj, unwantedKeys) => {
  return Object.keys(obj).reduce((filteredObj, key) => {
    if (!unwantedKeys.includes(key)) {
      filteredObj[key] = obj[key];
    }
    return filteredObj;
  }, {});
};

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "User does not exist" });
        }
        await user.login(password);
        user["_doc"] = filterJson(user["_doc"], ["password", "__v"]);
        return done(null, user);
      } catch (err) {
        return done(err, false, { message: err.message });
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authKeys.jwtSecretKey,
    },
    async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload._id);
        if (!user) {
          return done(null, false, { message: "JWT Token does not exist" });
        }
        user["_doc"] = filterJson(user["_doc"], ["password", "__v"]);
        return done(null, user);
      } catch (err) {
        return done(err, false, { message: "Incorrect Token" });
      }
    }
  )
);

module.exports = passport;
