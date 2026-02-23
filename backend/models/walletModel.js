const pool = require("../config/db");

const createWallet = async (userId) => {
  await pool.query(
    "INSERT INTO wallets (user_id) VALUES ($1)",
    [userId]
  );
};

const getWalletByUserId = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM wallets WHERE user_id = $1",
    [userId]
  );
  return result.rows[0];
};

const addTransaction = async (userId, amount, type, description) => {
  await pool.query(
    `INSERT INTO transactions (user_id, amount, type, description)
     VALUES ($1, $2, $3, $4)`,
    [userId, amount, type, description]
  );
};

const updateBalance = async (userId, amount) => {
  await pool.query(
    `UPDATE wallets
     SET balance = balance + $1
     WHERE user_id = $2`,
    [amount, userId]
  );
};

module.exports = {
  createWallet,
  getWalletByUserId,
  addTransaction,
  updateBalance
};