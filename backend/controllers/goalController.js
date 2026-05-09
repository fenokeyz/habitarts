const {
  createGoal,
  getTodayGoalsByCouple,
  markGoalComplete,
} = require("../models/goalModel");
const { updateBalance, addTransaction } = require("../models/walletModel");
const { getUserById } = require("../models/coupleModel");

const createGoalHandler = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const today = new Date().toISOString().split("T")[0];

    const { getUserById } = require("../models/coupleModel");

    const user = await getUserById(req.user.id);
    const coupleId = user.couple_id;

    const goal = await createGoal(
      title,
      req.user.id,
      coupleId || null,
      today
    );

    res.status(201).json(goal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create goal" });
  }
};

const getTodayGoalsHandler = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const user = await getUserById(req.user.id);
    const coupleId = user.couple_id;

    const goals = await getTodayGoalsByCouple(
      coupleId,
      req.user.id,
      today
    );

    res.json(goals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch goals" });
  }
};

const { getGoalById } = require("../models/goalModel");

const markGoalCompleteHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const goal = await getGoalById(id);

    if (!goal) {
      return res.status(404).json({
        error: "Goal not found"
      });
    }

    if (goal.user_id !== req.user.id) {
      return res.status(403).json({
        error: "You are not allowed to complete this goal"
      });
    }

    const updatedGoal = await markGoalComplete(id, req.user.id);

    if (!updatedGoal) {
    return res.status(400).json({
        error: "Goal already completed or invalid"
    });
    }

    // Reward coins
    const rewardAmount = 10;

    await updateBalance(req.user.id, rewardAmount);

    await addTransaction(
    req.user.id,
    rewardAmount,
    "credit",
    "Goal completed reward"
    );

    return res.json({
    message: "Goal completed! Coins rewarded.",
    reward: rewardAmount,
    goal: updatedGoal
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update goal" });
  }
};

module.exports = {
  createGoalHandler,
  getTodayGoalsHandler,
  markGoalCompleteHandler,
};