const pool = require("../config/db");

const createReward = async (title, description, cost, coupleId, userId) => {
  const result = await pool.query(
    `INSERT INTO rewards (title, description, cost, couple_id, created_by)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [title, description, cost, coupleId, userId]
  );

  return result.rows[0];
};

const getRewardsByCouple = async (coupleId) => {
  const result = await pool.query(
    `SELECT r.*
    FROM rewards r
    LEFT JOIN redemptions rd ON r.id = rd.reward_id
    WHERE r.couple_id = $1
      AND rd.id IS NULL`,
    [coupleId]
  );

  return result.rows;
};

const getRewardById = async (rewardId) => {
  const result = await pool.query(
    `SELECT * FROM rewards WHERE id = $1`,
    [rewardId]
  );

  return result.rows[0];
};

const isRewardRedeemed = async (rewardId) => {
  const result = await pool.query(
    "SELECT * FROM redemptions WHERE reward_id = $1",
    [rewardId]
  );

  return result.rows.length > 0;
};

const createRedemption = async (rewardId, userId) => {
  await pool.query(
    "INSERT INTO redemptions (reward_id, redeemed_by) VALUES ($1, $2)",
    [rewardId, userId]
  );
};

const fulfillReward = async (rewardId, userId) => {
  const result = await pool.query(
    `UPDATE redemptions r
     SET is_fulfilled = TRUE
     FROM rewards rw
     WHERE r.reward_id = rw.id
       AND r.reward_id = $1
       AND rw.created_by = $2
       AND r.is_fulfilled = FALSE
     RETURNING r.*`,
    [rewardId, userId]
  );

  return result.rows[0];
};

module.exports = {
  createReward,
  getRewardsByCouple,
  getRewardById,
  isRewardRedeemed,
  createRedemption,
  fulfillReward
};