const { Pool } = require("pg");

const pool = new Pool({
  user: "navaneethsuresh",   // your Mac username
  host: "localhost",
  database: "habitarts",
  password: "",              // leave empty if you didn't set one
  port: 5432,
});

module.exports = pool;