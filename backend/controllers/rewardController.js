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
    await updateBalance(req.user.id, -reward.cost);

    await addTransaction(
      req.user.id,
      -reward.cost,
      "debit",
      `Redeemed reward: ${reward.title}`
    );

    await createRedemption(reward.id, req.user.id);

    res.json({
      message: "Reward redeemed successfully",
      cost: reward.cost
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to redeem reward" });
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
  fulfillRewardHandler
};