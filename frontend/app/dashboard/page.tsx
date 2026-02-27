"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [wallet, setWallet] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [newGoal, setNewGoal] = useState("");
  const [rewards, setRewards] = useState<any[]>([]);
  const [newRewardTitle, setNewRewardTitle] = useState("");
  const [newRewardCost, setNewRewardCost] = useState("");
  const [pendingRedemptions, setPendingRedemptions] = useState<any[]>([]);
  type Toast = {
    id: number;
    message: string;
    };

    const [toasts, setToasts] = useState<Toast[]>([]);
    const [userInfo, setUserInfo] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const payload = JSON.parse(
    atob(token.split(".")[1])
    );
    setUserInfo(payload);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wallet`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          router.push("/login");
        } else {
          setWallet(data);
        }
      });


    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/goals/today`, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
    })
    .then(res => res.json())
    .then(data => {
        if (!data.error) {
        setGoals(data);
        }
    });
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rewards`, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
    })
    .then(res => res.json())
    .then(data => {
        if (!data.error) {
        setRewards(data);
        }
    });

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rewards/redemptions`, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
    })
    .then(res => res.json())
    .then(data => {
        if (!data.error) {
        setPendingRedemptions(data);
        }
    });



  }, []);

  const addGoal = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/goals/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title: newGoal }),
  });

  const data = await res.json();

  if (!data.error) {
    setGoals([...goals, data]);
    setNewGoal("");
  }
};

const addToast = (message: string) => {
  const id = Date.now();

  setToasts(prev => [...prev, { id, message }]);

  setTimeout(() => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, 5000);
};

const completeGoal = async (id: number) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/goals/${id}/complete`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!data.error) {
    setGoals(goals.map(g => g.id === id ? data.goal : g));

    // Refresh wallet
    const walletRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wallet`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const walletData = await walletRes.json();
    setWallet(walletData);

    addToast("Good job 💖 You earned 10 coins!");

    setTimeout(() => {
    setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  } else {
    alert(data.error);
  }
};

  if (!wallet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
const createReward = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rewards/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: newRewardTitle,
      cost: Number(newRewardCost),
    }),
  });

  const data = await res.json();

  if (!data.error) {
    setRewards([data, ...rewards]);
    setNewRewardTitle("");
    setNewRewardCost("");
    addToast("Reward created 💝");
  } else {
    alert(data.error);
  }
};

const redeemReward = async (id: number) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/rewards/${id}/redeem`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!data.error) {
    setRewards(rewards.filter(r => r.id !== id));

    const walletRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wallet`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const walletData = await walletRes.json();
    setWallet(walletData);

    addToast("Reward redeemed 🎉");
  } else {
    alert(data.error);
  }
};

const fulfillReward = async (id: number) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/rewards/${id}/fulfill`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!data.error) {
    setPendingRedemptions(
      pendingRedemptions.filter(r => r.reward_id !== id)
    );
    addToast("Reward fulfilled 💕");
  } else {
    alert(data.error);
  }
};

return (
  <div className="min-h-screen bg-[#FFF8EE] flex">

    {/* Sidebar */}
    <div className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold text-pink-400 mb-8">
          💖 Habitarts
        </h2>

        <nav className="space-y-4 text-black">
          <p className="hover:text-pink-400 cursor-pointer">Dashboard</p>
          <p className="hover:text-pink-400 cursor-pointer">Marketplace</p>
          <p className="hover:text-pink-400 cursor-pointer">Redemptions</p>
        </nav>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/login");
        }}
        className="bg-gray-200 px-4 py-2 rounded-lg text-black hover:bg-gray-300"
      >
        Logout
      </button>
    </div>

    {/* Main Content */}
    <div className="flex-1 p-10 space-y-10 overflow-y-auto">

      {/* Wallet */}
      <div className="bg-white p-6 rounded-2xl shadow-md w-80">
        <h2 className="text-xl font-semibold text-black">
          Wallet Balance
        </h2>
        <p className="text-3xl font-bold text-pink-500 mt-2">
          {wallet.balance} coins
        </p>
      </div>

    {/* Goals Section */}
    <div className="mt-10 bg-white p-6 rounded-2xl shadow-md w-96">
      <h2 className="text-xl font-semibold text-black mb-4">
        Today's Goals
      </h2>

      <div className="flex gap-2 mb-4">
        <input
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          className="flex-1 border p-2 rounded-lg text-black"
          placeholder="Add a goal..."
        />
        <button
          onClick={addGoal}
          className="bg-pink-400 text-white px-4 rounded-lg"
        >
          Add
        </button>
      </div>

      {goals.map(goal => (
        <div
          key={goal.id}
          className="flex justify-between items-center mb-2"
        >
          <span
            className={`text-black ${
              goal.is_completed ? "line-through text-gray-400" : ""
            }`}
          >
            {goal.title}
          </span>

          {!goal.is_completed && (
            <button
              onClick={() => completeGoal(goal.id)}
              className="text-sm bg-green-400 text-white px-2 py-1 rounded-lg"
            >
              Complete
            </button>
          )}
        </div>
      ))}
    </div>

    <div className="mt-10 bg-white p-6 rounded-2xl shadow-md w-96">
        <h2 className="text-xl font-semibold text-black mb-4">
            Marketplace
        </h2>

        <div className="flex gap-2 mb-4">
            <input
            value={newRewardTitle}
            onChange={(e) => setNewRewardTitle(e.target.value)}
            className="flex-1 border p-2 rounded-lg text-black"
            placeholder="Reward title"
            />
            <input
            value={newRewardCost}
            onChange={(e) => setNewRewardCost(e.target.value)}
            className="w-20 border p-2 rounded-lg text-black"
            placeholder="Cost"
            />
            <button
            onClick={createReward}
            className="bg-purple-400 text-white px-4 rounded-lg"
            >
            Add
            </button>
        </div>

        {rewards.map(reward => (
            <div
            key={reward.id}
            className="flex justify-between items-center mb-2"
            >
            <span className="text-black">
                {reward.title} — {reward.cost} coins
            </span>

            <button
                onClick={() => redeemReward(reward.id)}
                className="text-sm bg-blue-400 text-white px-2 py-1 rounded-lg"
            >
                Redeem
            </button>
            </div>
        ))}
    </div>

    <div className="mt-10 bg-white p-6 rounded-2xl shadow-md w-96">
    <h2 className="text-xl font-semibold text-black mb-4">
        Pending Redemptions
    </h2>

    {pendingRedemptions.length === 0 && (
        <p className="text-gray-400">No pending rewards</p>
    )}

    {pendingRedemptions.map(item => (
        <div
        key={item.redemption_id}
        className="flex justify-between items-center mb-2"
        >
        <span className="text-black">
            {item.title}
        </span>

        <button
            onClick={() => fulfillReward(item.reward_id)}
            className="text-sm bg-pink-400 text-white px-2 py-1 rounded-lg"
        >
            Mark Fulfilled
        </button>
        </div>
    ))}
    </div>

    </div>
  </div>
);




}