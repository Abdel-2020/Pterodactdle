const session = require("express-session");
const MongoStore = require("connect-mongo");

module.exports = session({
  secret: "some secret",
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
  }),
  cookie: { path: "/", httpOnly: true, secure: false, maxAge: null },
});
