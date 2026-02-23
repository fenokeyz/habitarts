const express = require("express");
const {
  createGoalHandler,
  getTodayGoalsHandler,
  markGoalCompleteHandler,
} = require("../controllers/goalController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createGoalHandler);
router.get("/today", protect, getTodayGoalsHandler);
router.patch("/:id/complete", protect, markGoalCompleteHandler);

module.exports = router;