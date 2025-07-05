const session = require("express-session");
const MongoStore = require("connect-mongo");

//creates a cookie which should last a day
module.exports = session({
  secret: "some secret",
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
  }),
  cookie: { 
    name: "Pterodactdle",
    path: "/", 
    httpOnly: true, 
    secure: false, 
    maxAge: (60000*60)*24, 
  },
  
  //Saves a session to the store even if it hasn't been modified.
  resave: false, 
  //A session is Uninitialized when it is new and unmodified. 
  //(Useful for saving server storage and/or complying with laws that require permission before setting a cookie)
  saveUninitialized: false,
});
