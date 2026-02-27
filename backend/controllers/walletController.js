const { getWalletByUserId } = require("../models/walletModel");
const pool = require("../config/db");

const getWalletHandler = async (req, res) => {
  try {
    const wallet = await getWalletByUserId(req.user.id);

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    res.json(wallet);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch wallet" });
  }
};

const getTransactionsHandler = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM transactions
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

module.exports = {
  getWalletHandler,
  getTransactionsHandler
};