const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getWalletHandler,
  getTransactionsHandler
} = require("../controllers/walletController");

const router = express.Router();

router.get("/", protect, getWalletHandler);
router.get("/transactions", protect, getTransactionsHandler);

module.exports = router;