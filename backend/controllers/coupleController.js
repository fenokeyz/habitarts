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

    res.status(201).json(couple);
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

    // fetch updated partner info
    const partnerResult = await pool.query(
      "SELECT id, name, email FROM users WHERE couple_id = $1 AND id != $2",
      [couple.id, user.id]
    );

    const partner = partnerResult.rows[0] || null;

    res.json({
      couple,
      partner,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to join couple" });
  }
};

const pool = require("../config/db");

const updateRelationshipDate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.body;

    // Find user's couple
    const userResult = await pool.query(
      "SELECT couple_id FROM users WHERE id = $1",
      [userId]
    );

    const coupleId = userResult.rows[0]?.couple_id;

    if (!coupleId) {
      return res.status(400).json({ error: "User not in a couple" });
    }

    await pool.query(
      "UPDATE couples SET created_at = $1 WHERE id = $2",
      [date, coupleId]
    );

    res.json({ message: "Relationship date updated" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update date" });
  }
};

const unlinkCouple = async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.id;

    await client.query("BEGIN");

    const userResult = await client.query(
      "SELECT couple_id FROM users WHERE id = $1",
      [userId]
    );

    const coupleId = userResult.rows[0]?.couple_id;

    if (!coupleId) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Not in a couple" });
    }

    await client.query(
      "UPDATE users SET couple_id = NULL WHERE couple_id = $1",
      [coupleId]
    );

    await client.query(
      "DELETE FROM couples WHERE id = $1",
      [coupleId]
    );

    await client.query("COMMIT");

    res.json({ message: "Relationship dissolved" });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
};

const cancelInvite = async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.id;

    await client.query("BEGIN");

    const userResult = await client.query(
      "SELECT couple_id FROM users WHERE id = $1",
      [userId]
    );

    const coupleId = userResult.rows[0]?.couple_id;

    if (!coupleId) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "No couple to cancel" });
    }

    const members = await client.query(
      "SELECT COUNT(*) FROM users WHERE couple_id = $1",
      [coupleId]
    );

    if (Number(members.rows[0].count) > 1) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        error: "Cannot cancel, partner already joined",
      });
    }

    await client.query(
      "UPDATE users SET couple_id = NULL WHERE id = $1",
      [userId]
    );

    await client.query(
      "DELETE FROM couples WHERE id = $1",
      [coupleId]
    );

    await client.query("COMMIT");

    res.json({ message: "Invite cancelled" });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
};

module.exports = { createCoupleHandler, joinCoupleHandler, updateRelationshipDate, unlinkCouple, cancelInvite };