const mysql = require("mysql2");
const path = require("path");

// __dirname points directly to the 'utils' folder.
// '../.env' moves one level up to 'MongoDB_airbnb' and targets the file.
const envPath = path.resolve(__dirname, '../.env'); 
require("dotenv").config({ path: envPath }); // Loads the variables from the .env file

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = pool.promise();
