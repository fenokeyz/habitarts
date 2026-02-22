const crypto = require("crypto");
const {
  createCouple,
  attachUserToCouple,
  getUserById,
  findCoupleByInviteCode,
} = require("../models/coupleModel");

const createCoupleHandler = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

    if (user.couple_id) {
      return res.status(400).json({ error: "User already in a couple" });
    }

    const inviteCode = crypto.randomBytes(3).toString("hex");

    const couple = await createCouple(inviteCode);

    await attachUserToCouple(user.id, couple.id);

    res.status(201).json({
      message: "Couple created",
      inviteCode: couple.invite_code,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create couple" });
  }
};

const joinCoupleHandler = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    const user = await getUserById(req.user.id);

    if (user.couple_id) {
      return res.status(400).json({ error: "User already in a couple" });
    }

    const couple = await findCoupleByInviteCode(inviteCode);

    if (!couple) {
      return res.status(404).json({ error: "Invalid invite code" });
    }

    await attachUserToCouple(user.id, couple.id);

    res.json({ message: "Successfully joined couple" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to join couple" });
  }
};

module.exports = { createCoupleHandler, joinCoupleHandler };