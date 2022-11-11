require("dotenv").config();
const { createConnection } = require("harpee");

const dbConfig = {
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
};
const connectDB = () => {
  createConnection(dbConfig);
};

module.exports = {
  connectDB,
};
