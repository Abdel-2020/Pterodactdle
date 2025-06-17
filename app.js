require("dotenv").config();
const express = require("express");
const app = express();
const port = 5050;

//express router
const dinos = require("./routes/routes");

//DB Connection
const connectDB = require("./db/connect");

//Mongo Session Store
const sessionMiddleware = require("./session/sessions");

//Middleware
app.use(sessionMiddleware);
app.use(express.json());
app.use(express.static("./public"));

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
