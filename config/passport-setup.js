const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("./keys");
const User = require("../models/user-model");

const randomstring = require("randomstring");

// serialize: function that takes a piece of info from record and then pass it on to stuff in a cookie
passport.serializeUser((user, done) => {
  done(null, user.id); //first param is for error
});

// deserialize: when cookie comes to the server as the browser makes a request for the profile
// page (example) we're going to receive the ID and we're gonna deserialize it so we can grab
// a user from that ID.
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      // options for the google strat
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
      callbackURL: "/auth/google/redirect"
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({
        googleId: profile.id
      }).then(foundUser => {
        if (foundUser) {
          return done(null, foundUser);
        }
        new User({
          username: randomstring.generate(12),
          googleId: profile.id
        })
          .save()
          .then(newUser => {
            console.log("new user created", newUser);
            done(null, newUser);
          });
      });
    }
  )
);
