require("dotenv").config();
const {Client, Pool} = require('pg');
const connectionString = process.env.PG_URI;

const pool = new Pool({
connectionString,
})

const query = async (text, params) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text, duration, rows: res.rowCount });
  return res;
}

//Grab a client from the pool to run several queries in a transaction
const getClient = () => {
  return pool.connect();
}

module.exports = {
  query,
  pool
}

/*
const mongoose = require("mongoose");
const connectDB = (url) => {
  return mongoose.connect(url);
};
*/



