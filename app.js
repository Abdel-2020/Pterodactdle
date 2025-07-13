require("dotenv").config();

const express = require("express");
const app = express();
const port = 5050;

// Manage Cookies/Sessions
const cookieParser = require('cookie-parser');
app.use(cookieParser(process.env.SECRET));
const {sessionMiddleware} = require("./session/sessions");
// express router
const dinos = require("./routes/routes");

// DB Connection
const connectDB = require("./db/connect");

// Middleware 
app.use(express.json());
app.use(express.static("./public"));
app.use(sessionMiddleware);





const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(port, () => {
      console.log(`Listening on port ${port} ...`);
    });
  } catch (error) {
    console.log(error);
  }
};


// Routes
// Any requests to the below paths, will be handled by the router

app.use("/api/v1/dinos", dinos);
//app.get("/", ()=>{console.log('Client session ID:', req.sessionID);})


start();
