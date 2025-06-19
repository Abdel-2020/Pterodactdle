const session = require("express-session");
const MongoStore = require("connect-mongo");

//creates a cookie which should last a day


module.exports = session({
  secret: "some secret",
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
  }),
  cookie: { 
    path: "/", 
    httpOnly: true, 
    secure: false, 
    maxAge: (60000*60)*24 
  },
  resave: false,
  saveUninitialized: false
});
