const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Habitarts API Running 💖");
});
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database connection failed");
  }
});

const PORT = process.env.PORT || 7777;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});