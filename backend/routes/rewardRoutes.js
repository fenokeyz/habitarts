const express = require("express");
const {
  createRewardHandler,
  getRewardsHandler,
  redeemRewardHandler,
  fulfillRewardHandler,
} = require("../controllers/rewardController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createRewardHandler);
router.get("/", protect, getRewardsHandler);
router.post("/:id/redeem", protect, redeemRewardHandler);
router.patch("/:id/fulfill", protect, fulfillRewardHandler);

module.exports = router;