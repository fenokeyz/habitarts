const {
  createReward,
  getRewardsByCouple,
  getRewardById,
  isRewardRedeemed,
  createRedemption,
  fulfillReward,
} = require("../models/rewardModel");

const {
  getWalletByUserId,
  updateBalance,
  addTransaction
} = require("../models/walletModel");

const pool = require("../config/db");
const { get } = require("../routes/rewardRoutes");

const createRewardHandler = async (req, res) => {
  try {
    const { title, description, cost } = req.body;

    if (!title || !cost) {
      return res.status(400).json({ error: "Title and cost are required" });
    }

    const reward = await createReward(
      title,
      description,
      cost,
      req.user.couple_id,
      req.user.id
    );

    res.status(201).json(reward);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create reward" });
  }
};

const getRewardsHandler = async (req, res) => {
  try {
    const rewards = await getRewardsByCouple(req.user.couple_id);
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rewards" });
  }
};

const redeemRewardHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const reward = await getRewardById(id);

    if (!reward) {
    return res.status(404).json({ error: "Reward not found" });
    }

    if (reward.couple_id !== req.user.couple_id) {
    return res.status(403).json({
        error: "You are not allowed to access this reward"
    });
    }

    if (reward.created_by === req.user.id) {
    return res.status(403).json({
        error: "You cannot redeem your own reward"
    });
    }

    if (!reward) {
      return res.status(404).json({ error: "Reward not found" });
    }

    const wallet = await getWalletByUserId(req.user.id);

    if (wallet.balance < reward.cost) {
      return res.status(400).json({ error: "Insufficient coins" });
    }

    const alreadyRedeemed = await isRewardRedeemed(reward.id);

    if (alreadyRedeemed) {
      return res.status(400).json({
        error: "Reward already redeemed"
      });
    }

    // Deduct balance
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      await client.query(
        `UPDATE wallets
        SET balance = balance - $1
        WHERE user_id = $2`,
        [reward.cost, req.user.id]
      );

      await client.query(
        `INSERT INTO transactions (user_id, amount, type, description)
        VALUES ($1, $2, $3, $4)`,
        [
          req.user.id,
          -reward.cost,
          "debit",
          `Redeemed reward: ${reward.title}`
        ]
      );

      await client.query(
        `INSERT INTO redemptions (reward_id, redeemed_by)
        VALUES ($1, $2)`,
        [reward.id, req.user.id]
      );

      await client.query("COMMIT");

    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }

    res.json({
      message: "Reward redeemed successfully",
      cost: reward.cost
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to redeem reward" });
  }
};

const getPendingRedemptionsHandler = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.id as reward_id,
              r.title,
              rd.id as redemption_id
       FROM redemptions rd
       JOIN rewards r ON rd.reward_id = r.id
       WHERE r.created_by = $1
         AND rd.is_fulfilled = FALSE`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch redemptions" });
  }
};

const fulfillRewardHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await fulfillReward(id, req.user.id);

    if (!result) {
      return res.status(400).json({
        error: "Cannot fulfill reward"
      });
    }

    res.json({
      message: "Reward marked as fulfilled"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fulfill reward" });
  }
};

module.exports = {
  createRewardHandler,
  getRewardsHandler,
  redeemRewardHandler,
  fulfillRewardHandler,
  getPendingRedemptionsHandler
};