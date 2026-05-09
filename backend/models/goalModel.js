const pool = require("../config/db");

const createGoal = async (title, userId, coupleId, goalDate) => {
  const result = await pool.query(
    `INSERT INTO goals (title, user_id, couple_id, goal_date)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, userId, coupleId, goalDate]
  );

  return result.rows[0];
};

const getTodayGoalsByCouple = async (coupleId,userId,today) => {

  let result;

  if (coupleId) {
    result = await pool.query(
      `SELECT *
       FROM goals
       WHERE couple_id = $1
         AND goal_date = $2
       ORDER BY created_at ASC`,
      [coupleId, today]
    );
  } else {
    result = await pool.query(
      `SELECT *
       FROM goals
       WHERE user_id = $1
         AND couple_id IS NULL
         AND goal_date = $2
       ORDER BY created_at ASC`,
      [userId, today]
    );
  }

  return result.rows;
};

const getGoalById = async (goalId) => {
  const result = await pool.query(
    "SELECT * FROM goals WHERE id = $1",
    [goalId]
  );
  return result.rows[0];
};

const markGoalComplete = async (goalId, userId) => {
  const result = await pool.query(
    `UPDATE goals
     SET is_completed = TRUE
     WHERE id = $1 
       AND user_id = $2
       AND is_completed = FALSE
     RETURNING *`,
    [goalId, userId]
  );

  return result.rows[0];
};

module.exports = {
  createGoal,
  getTodayGoalsByCouple,
  markGoalComplete,
  getGoalById,
};