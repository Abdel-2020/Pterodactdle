require("dotenv").config();

const express = require("express");
const http = require('http');
const port = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app); //Attach express to raw HTTP server

// Manage Cookies/Sessions
const cookieParser = require('cookie-parser');
app.use(cookieParser(process.env.SECRET));
const {sessionMiddleware} = require("./session/sessions");

// express router
const router = require("./api/routes/routes");

// DB Connection
const  {query} = require("./db/connect");

// Middleware 
app.use(express.json());
app.use(express.static("./public"));
app.use(sessionMiddleware);


const start = async () => {
  try {
    const res = await query('SELECT NOW()');
    server.listen(port, () => {
      console.log(`Listening on port ${port} ...`);
    });
  } catch (error) {
    console.log(error);
  }
};


// Routes
// Any requests to the below path will be handled by the router
app.use("/api/v1/dinos", router);


start();

module.exports = app;
