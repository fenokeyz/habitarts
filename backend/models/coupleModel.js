const pool = require("../config/db");

const createCouple = async (inviteCode) => {
  const result = await pool.query(
    "INSERT INTO couples (invite_code) VALUES ($1) RETURNING *",
    [inviteCode]
  );

  return result.rows[0];
};

const attachUserToCouple = async (userId, coupleId) => {
  await pool.query(
    "UPDATE users SET couple_id = $1 WHERE id = $2",
    [coupleId, userId]
  );
};

const getUserById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

const findCoupleByInviteCode = async (inviteCode) => {
  const result = await pool.query(
    "SELECT * FROM couples WHERE invite_code = $1",
    [inviteCode]
  );
  return result.rows[0];
};

module.exports = {
  createCouple,
  attachUserToCouple,
  getUserById,
  findCoupleByInviteCode,
};