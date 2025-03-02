//express
const express = require("express");
const app = express();
const port = 5050;

//express router
const dinos = require("./routes/routes");

//DB Connection
const connectDB = require("./db/connect");

//dotenv
require("dotenv").config();

//Middleware
app.use(express.json());
app.use(express.static("./public"));

//console.log(process.env.MONGO_URI);

const start = async () => {
  try {
    connectDB(process.env.MONGO_URI);

    app.listen(port, () => {
      console.log(`Listening on port ${port} ...`);
    });
  } catch (error) {
    console.log(error);
  }
};

//routes
app.use("/api/v1/dinos", dinos);

start();
