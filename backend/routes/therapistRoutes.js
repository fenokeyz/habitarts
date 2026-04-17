const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { therapistChat,getTherapistHistory } = require("../controllers/therapistController");

const router = express.Router();

router.post("/chat", protect, therapistChat);
router.get("/history", protect, getTherapistHistory);

module.exports = router;