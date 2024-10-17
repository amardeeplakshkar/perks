"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FaCheck, FaHandPointer } from "react-icons/fa";
import { TrophySpin } from "react-loading-indicators";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ChickenImg from "../app/giphy.gif";
import { TASKS as initialTasks } from "../constants"; // Import initial tasks
import TonLogo from "../app/public/ton-logo.png";
import { toast } from "react-toastify";

const recipient =
  process.env.NEXT_PUBLIC_TON_WALLET_ADDRESS ||
  "UQCFxWYZpOuoBmVq1eL3kEvR8q2IAN2oEpTYjM89xlZ6YB1Z"; // Replace with your TON address

const TaskCard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState(initialTasks); // Initialize tasks with state
  const [tonConnectUI] = useTonConnectUI();
  const router = useRouter();

  const checkAllTasksCompleted = (updatedTasks) => {
    const allCompleted = updatedTasks.every((task) => task.completed);
    if (allCompleted) {
      toast.success("All tasks completed! 🎉");
    }
  };

  const sendTransaction = useCallback(async () => {
    if (!tonConnectUI.connected) {
      router.push("/wallet");
      return;
    }

    setIsLoading(true);
    try {
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [
          {
            address: recipient,
            amount: (0.001 * 1e9).toString(), // Convert 0.001 TON to nanoTON
          },
        ],
      });

      toast.success("Transaction successful! 5000 COCKS added 🎉");

      const userId = user?.telegramId;
      const taskId = "810a64761a0fd871189af34d"; // Make sure this is a valid task ID
      const points = 5000;

      const response = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, taskId, points }),
      });

      if (response.status === 200) {
        const updatedTasks = tasks.map((t) =>
          t.id === taskId ? { ...t, completed: true } : t
        );
        setTasks(updatedTasks);
        checkAllTasksCompleted(updatedTasks);
      } else {
        throw new Error("Failed to update points.");
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error("❌ Transaction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [tonConnectUI, router, user, tasks]);

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
        toast.success(`✅ ${task.name} completed!`);

        const updatedTasks = tasks.map((t) =>
          t.id === id ? { ...t, completed: true } : t
        );
        setTasks(updatedTasks);
        checkAllTasksCompleted(updatedTasks);

        window.open(path, "_blank");
      } else {
        throw new Error("Failed to claim task.");
      }
    } catch (error) {
      console.error("Claim task error:", error);
      toast.error("❌ Failed to claim task. Please try again.");
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

  const preventInteraction = (e) => {
    e.preventDefault();
  };

  return (
    <div className="w-full mx-auto p-2 rounded-lg shadow-md overflow-y-scroll">
      <h2 className="text-xl font-semibold text-white my-2 mb-4 flex ">
        Daily Tasks{" "}
        <img
          src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Smileys/Exploding%20Head.webp"
          alt="Exploding Head"
          width="25"
          height="25"
          className="no-interaction"
          onContextMenu={preventInteraction}
          onTouchStart={preventInteraction}
          draggable={false}
        />
      </h2>

      <div className="flex items-center justify-between bg-slate-100/15 p-3 rounded-lg mb-2">
        <div className="flex justify-center items-center gap-2">
          <div className="bg-zinc-900 rounded-full h-[2rem] w-[2rem] flex justify-center items-center">
            <Image src={TonLogo} />
          </div>
          <div>
            <div className="text-white font-semibold text-sm">
              Make Ton Transaction
            </div>
            <div className="text-xs">+5000 COCKS</div>
          </div>
        </div>
        <div className="grid place-items-center">
          <button
            onClick={sendTransaction}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded"
          >
            {isLoading ? "Processing..." : <FaHandPointer />}
          </button>
        </div>
      </div>
      <h2 className="text-xl font-semibold text-white my-2  mb-4">
        Earn for checking socials {tasks.filter((t) => t.completed).length}/
        {tasks.length}
      </h2>
      <div className="pb-6 overflow-scroll max-h-[80dvh] w-full space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between bg-slate-100/15 p-3 rounded-lg"
          >
            <div className="flex justify-center items-center gap-2">
              <div className="bg-zinc-900 rounded-full p-2">{task.icon}</div>
              <div>
                <div className="text-white font-semibold text-sm">
                  {task.name}
                </div>
                <div className="text-xs">+{task.points} COCKS</div>
              </div>
            </div>
            <div className="grid place-items-center">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskCard;
