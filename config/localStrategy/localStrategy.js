const LocalStrategy = require("passport-local").Strategy;
const db = require("../../prisma/query");
const bcryptjs = require("bcryptjs");

module.exports = {
  localStrategy: new LocalStrategy(async function verify(
    username,
    password,
    done
  ) {
    try {
      const usernameDb = await db.findUserByUsername({ username: username });
      const user = usernameDb;

      if (!user) {
        return done(null, false, { message: "Incorrect Username" });
      }

      const isMatched = await bcryptjs.compare(password, user.password);
      if (!isMatched) {
        return done(null, false, { message: "Incorrect Password" });
      }
      return done(null, user);
    } catch (error) {
      done(error);
    }
  }),

  serializer: (user, done) => {
    done(null, user.id);
  },

  deserializer: async (id, done) => {
    try {
      const user = await db.findUserById({ id: id });

      done(null, user);
    } catch (err) {
      done(err);
    }
  },
};
