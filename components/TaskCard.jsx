"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FaCheck, FaHandPointer } from "react-icons/fa";
import { TrophySpin } from "react-loading-indicators";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ChickenImg from "../app/giphy.gif";

const recipient = process.env.NEXT_PUBLIC_TON_WALLET_ADDRESS || "YOUR_TON_ADDRESS"; // Replace with your TON address

const TaskCard = () => {
  const [tasks, setTasks] = useState([
    { id: 1, name: "Check COCKS Telegram", points: 500, completed: false, path: "https://t.me/cocks_community" },
    { id: 2, name: "Check COCKS Instagram", points: 250, completed: false, path: "https://instagram.com/cocks_community" },
    { id: 3, name: "Check COCKS X", points: 250, completed: false, path: "https://x.com/cocks_community" },
    { id: 4, name: "Check COCKS Facebook", points: 250, completed: false, path: "https://facebook.com/cocks_community" },
    { id: 5, name: "Check COCKS Discord", points: 250, completed: false, path: "https://t.me/cocks_community" },
    { id: 6, name: "Check COCKS YouTube", points: 250, completed: false, path: "https://youtube.com/cocks_community" },
  ]);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [tonConnectUI] = useTonConnectUI();
  const router = useRouter();

  // Ensure the wallet is connected, else redirect
  useEffect(() => {
    if (!tonConnectUI.connected) {
      router.push("/wallet");
    } else {
      setLoading(false);
    }
  }, [tonConnectUI, router]);

  const sendTransaction = useCallback(async () => {
    if (!tonConnectUI.connected) {
      router.push("/wallet");
      return;
    }

    setIsLoading(true);
    try {
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 60, // Valid for 60 seconds
        messages: [
          {
            address: recipient,
            amount: (0.01 * 1e9).toString(), // Convert TON to nanoTON
          },
        ],
      });
      alert("Transaction successful!");
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [tonConnectUI]);

  const fetchUserData = async () => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      const initDataUnsafe = tg.initDataUnsafe || {};
      if (initDataUnsafe.user) {
        try {
          const response = await fetch("/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(initDataUnsafe.user),
          });

          const data = await response.json();
          if (!data.error) {
            setUser(data);
            setTasks((prevTasks) =>
              prevTasks.map((task) =>
                data.completedTaskIds.includes(task.id)
                  ? { ...task, completed: true }
                  : task
              )
            );
          }
        } catch (err) {
          console.error("Failed to fetch user data:", err.message);
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleClaim = async (id, path) => {
    if (!user) return;

    const task = tasks.find((task) => task.id === id);
    const userId = user.telegramId;

    try {
      const response = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, taskId: task.id, points: task.points }),
      });

      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id ? { ...task, completed: true } : task
          )
        );
        window.open(path, "_blank");
      }
    } catch (error) {
      console.error("Failed to claim task:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex gap-2 flex-col justify-center items-center min-h-screen bg-white">
        <Image src={ChickenImg} alt="Loading" width={150} height={150} />
        <TrophySpin color="#32cd32" size="medium" />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-2 rounded-lg shadow-md overflow-y-scroll">
      <h2 className="text-xl font-semibold text-white mb-4">
        Earn for checking socials {tasks.filter((t) => t.completed).length}/
        {tasks.length}
      </h2>
      <div className="pb-6 overflow-scroll max-h-[80dvh] w-full space-y-2">
        <div className="p-4 bg-gray-100 rounded-lg">
          <h2>Task: Send 0.01 TON</h2>
          <button
            onClick={sendTransaction}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            {isLoading ? "Processing..." : "Send 0.01 TON"}
          </button>
        </div>
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between bg-slate-600/15 p-3 rounded-lg"
          >
            <div>
              <div className="text-white font-semibold text-sm">
                {task.name}
              </div>
              <div className="text-xs">+{task.points} COCKS</div>
            </div>
            <button
              onClick={() => handleClaim(task.id, task.path)}
              disabled={task.completed}
              className={`${
                task.completed
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              } text-white p-2 rounded-lg transition`}
            >
              {task.completed ? <FaCheck /> : <FaHandPointer />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskCard;
