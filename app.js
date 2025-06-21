require("dotenv").config();
const express = require("express");
const app = express();
const port = 5050;

//Mongo Session Store
const sessionMiddleware = require("./session/sessions");

//express router
const dinos = require("./routes/routes");

//DB Connection
const connectDB = require("./db/connect");

//Middleware 
app.use(sessionMiddleware);
app.use(express.json());
app.use(express.static("./public"));
//TRYING TO FIGURE OUT HOW TO ACCESS COOKIE ON RECONNECTING THE SESSION



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
//Any requests to the below paths, should be handled by the router
app.use("/api/v1/dinos", dinos);



start();
