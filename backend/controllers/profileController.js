const pool = require("../config/db");

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const userResult = await pool.query(
      "SELECT id, name, email, couple_id FROM users WHERE id = $1",
      [userId]
    );

    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let partner = null;
    let couple = null;

    if (user.couple_id) {
      const partnerResult = await pool.query(
        "SELECT id, name, email FROM users WHERE couple_id = $1 AND id != $2",
        [user.couple_id, userId]
      );

      partner = partnerResult.rows[0] || null;

      const coupleResult = await pool.query(
        "SELECT id, invite_code, created_at FROM couples WHERE id = $1",
        [user.couple_id]
      );

      couple = coupleResult.rows[0];
    }

    res.json({
      user,
      partner,
      couple,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

module.exports = { getProfile };