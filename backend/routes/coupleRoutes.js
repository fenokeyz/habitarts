const express = require("express");
const { createCoupleHandler, joinCoupleHandler,updateRelationshipDate,unlinkCouple,cancelInvite } = require("../controllers/coupleController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/create", protect, createCoupleHandler);
router.post("/join", protect, joinCoupleHandler);
router.patch("/unlink", protect, unlinkCouple);
router.post("/create", protect, createCoupleHandler);
router.patch("/update-date", protect, updateRelationshipDate);
router.delete("/cancel", protect, cancelInvite);

module.exports = router;