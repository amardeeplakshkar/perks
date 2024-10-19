"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FaCheck, FaHandPointer } from "react-icons/fa";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { TASKS } from "../constants"; // Ensure this path is correct
import TonLogo from "../app/public/ton-logo.png";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const recipient =
  process.env.NEXT_PUBLIC_TON_WALLET_ADDRESS ||
  "UQCFxWYZpOuoBmVq1eL3kEvR8q2IAN2oEpTYjM89xlZ6YB1Z";

const TaskCard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState({});
  const [anyLoading, setAnyLoading] = useState(false);
  const [tasks, setTasks] = useState(TASKS);
  const [tonConnectUI] = useTonConnectUI();
  const router = useRouter();

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
          } else {
            toast.error(data.error || "Failed to fetch user data.");
          }
        } catch (err) {
          console.error("Failed to fetch user data:", err.message);
          toast.error("Failed to fetch user data.");
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const checkAllTasksCompleted = (updatedTasks) => {
    const allCompleted = updatedTasks.every((task) => task.completed);
    if (allCompleted) {
      toast.success("All tasks completed! 🎉");
    }
  };

  const handleSocialTaskClaim = async (id, path) => {
    // Open the link immediately
    window.open(path, "_blank"); // Open in a new tab
  
    // Check if user is defined
    if (!user) {
      console.error("User is not defined");
      return;
    }
  
    const task = tasks.find((t) => t.id === id);
    if (!task) {
      toast.error("Task not found.");
      return;
    }
  
    setLoadingTasks((prev) => ({ ...prev, [id]: true }));
    setAnyLoading(true);
  
    // Delay the API call for 10 seconds
    setTimeout(async () => {
      try {
        const response = await fetch("/api/complete-task", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: String(user.telegramId),
            taskId: id,
            points: task.points,
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to claim task.");
        }
  
        const updatedTasks = tasks.map((task) =>
          task.id === id ? { ...task, completed: true } : task
        );
        setTasks(updatedTasks);
        checkAllTasksCompleted(updatedTasks);
        toast.success("Task completed!");
      } catch (error) {
        console.error("Error claiming task:", error);
        toast.error(error.message || "Error claiming task.");
      } finally {
        setLoadingTasks((prev) => ({ ...prev, [id]: false }));
        setAnyLoading(false);
      }
    }, 10000); // 10 seconds delay
  };
  
  

  const sendTransaction = useCallback(async () => {
    if (!tonConnectUI.connected) {
      router.push("/");
      toast.error("Connect Wallet First");
      return;
    }

    setIsLoading(true);
    try {
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [
          {
            address: recipient,
            amount: (0.001 * 1e9).toString(),
          },
        ],
      });

      toast.success("Transaction successful! 5000 COCKS added 🎉");
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error("Transaction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [tonConnectUI, router]);

  const preventInteraction = (e) => e.preventDefault();

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }

  return (
    <div className="w-full mx-auto p-2 rounded-lg shadow-md overflow-y-scroll">
      <h2 className="text-xl font-semibold text-white my-2 mb-4 flex items-center">
        Daily Tasks
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
        <div className="flex items-center gap-2">
          <div className="bg-zinc-900 rounded-full h-8 w-8 flex items-center justify-center">
            <Image src={TonLogo} alt="TON Logo" width={30} height={30} priority />
          </div>
          <div>
            <div className="text-white font-semibold text-sm">Make Ton Transaction</div>
            <div className="text-xs">+5000 COCKS</div>
          </div>
        </div>
        <button
          onClick={sendTransaction}
          disabled={isLoading || anyLoading}
          className={`bg-blue-500 hover:bg-blue-700 text-white p-2 rounded ${isLoading || anyLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          {isLoading ? "Processing..." : <FaHandPointer />}
        </button>
      </div>

      <h2 className="text-xl font-semibold text-white my-2 mb-4">
        Earn for checking socials {tasks.filter((t) => t.completed).length}/{tasks.length}
      </h2>

      <div className="pb-16 overflow-scroll max-h-[70dvh] w-full space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between bg-slate-100/15 p-3 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <div className="bg-zinc-900 rounded-full p-2">{task.icon}</div>
              <div>
                <div className="text-white font-semibold text-sm">{task.name}</div>
                <div className="text-xs">+{task.points} COCKS</div>
              </div>
            </div>
            <a href={task.path} target="_blank">
            <button
              onClick={() => handleSocialTaskClaim(task.id, task.path)}
              disabled={task.completed || loadingTasks[task.id] || anyLoading}
              className={`text-white p-2 rounded-lg transition ${task.completed
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
              } ${anyLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
              {loadingTasks[task.id] ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : task.completed ? (
                <FaCheck />
              ) : (
                <FaHandPointer />
              )}
            </button>
              </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskCard;
