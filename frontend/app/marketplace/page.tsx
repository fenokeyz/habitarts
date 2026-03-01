"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MarketplaceSection from "@/components/MarketplaceSection";
import { useToast } from "@/components/ToastProvider";
import AppLayout from "@/components/AppLayout";

export default function MarketplacePage() {
  const [rewards, setRewards] = useState<any[]>([]);
  const [newRewardTitle, setNewRewardTitle] = useState("");
  const [newRewardCost, setNewRewardCost] = useState("");
  const router = useRouter();
  const { addToast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rewards`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) setRewards(data);
      });
  }, []);

  const createReward = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/rewards/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newRewardTitle,
          cost: Number(newRewardCost),
        }),
      }
    );

    const data = await res.json();

    if (!data.error) {
      setRewards([data, ...rewards]);
      setNewRewardTitle("");
      setNewRewardCost("");
      addToast("Reward created 💝");
    }
  };

  const redeemReward = async (id: number) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/rewards/${id}/redeem`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();

    if (!data.error) {
      setRewards(rewards.filter(r => r.id !== id));
      addToast("Reward redeemed 🎉");
    }
  };

  return (
    <AppLayout>
      <MarketplaceSection
        rewards={rewards}
        newRewardTitle={newRewardTitle}
        newRewardCost={newRewardCost}
        setNewRewardTitle={setNewRewardTitle}
        setNewRewardCost={setNewRewardCost}
        createReward={createReward}
        redeemReward={redeemReward}
      />
    </AppLayout>
  );
}