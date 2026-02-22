const express = require("express");
const { createCoupleHandler, joinCoupleHandler } = require("../controllers/coupleController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createCoupleHandler);
router.post("/join", protect, joinCoupleHandler);

module.exports = router;