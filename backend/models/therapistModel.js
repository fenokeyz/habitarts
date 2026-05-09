const pool = require("../config/db");

const saveMessage = async (coupleId, userId, role, message) => {
  const result = await pool.query(
    `INSERT INTO therapist_messages (couple_id, user_id, role, message)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [coupleId, userId, role, message]
  );

  return result.rows[0];
};

const getMessages = async (coupleId, userId) => {
  let result;

  if (coupleId) {
    result = await pool.query(
      `SELECT m.*, u.name
       FROM therapist_messages m
       LEFT JOIN users u ON m.user_id = u.id
       WHERE m.couple_id = $1
       ORDER BY created_at ASC
       LIMIT 20`,
      [coupleId]
    );
  } else {
    result = await pool.query(
      `SELECT m.*, u.name
       FROM therapist_messages m
       LEFT JOIN users u ON m.user_id = u.id
       WHERE m.user_id = $1 AND m.couple_id IS NULL
       ORDER BY created_at ASC
       LIMIT 20`,
      [userId]
    );
  }

  return result.rows;
};

module.exports = {
  saveMessage,
  getMessages,
};