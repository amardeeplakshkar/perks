"use client";
import React, { useState, useEffect } from "react";
import { FaCheck, FaHandPointer } from "react-icons/fa";
import { TrophySpin } from "react-loading-indicators";
import ChickenImg from "../app/giphy.gif";
import Image from "next/image";

const TaskCard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "Check COCKS Telegram",
      points: 500,
      completed: false,
      path: "https://t.me/cocks_community",
    },
    {
      id: 2,
      name: "Check COCKS Instagram",
      points: 250,
      completed: false,
      path: "https://instagram.com/cocks_community",
    },
    {
      id: 3,
      name: "Check COCKS X",
      points: 250,
      completed: false,
      path: "https://x.com/cocks_community",
    },
    {
      id: 4,
      name: "Check COCKS Facebook",
      points: 250,
      completed: false,
      path: "https://facebook.com/cocks_community",
    },
    {
      id: 5,
      name: "Check COCKS Discord",
      points: 250,
      completed: false,
      path: "https://t.me/cocks_community",
    },
    {
      id: 6,
      name: "Check COCKS YouTube",
      points: 250,
      completed: false,
      path: "https://youtube.com/cocks_community",
    },
  ]);

  useEffect(() => {
    const fetchUser = async () => {
      if (typeof window !== "undefined" && window.Telegram?.WebApp) {
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
  
            if (data.error) {
              setError(data.error);
            } else {
              setUser(data);
              // Update tasks with the completion status
              setTasks((prevTasks) =>
                prevTasks.map((task) =>
                  data.completedTaskIds.includes(task.id)
                    ? { ...task, completed: true }
                    : task
                )
              );
            }
          } catch (err) {
            setError("Failed to fetch user data: " + err.message);
          }
        } else {
          setError("No user data available");
        }
      } else {
        setError("This app should be opened in Telegram");
      }
      setLoading(false);
    };
  
    fetchUser();
  }, []);
  

  const handleClaim = async (id, path) => {
    if (!user) {
      return;
    }

    const task = tasks.find((task) => task.id === id);
    const userId = user.telegramId;

    try {
      const response = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, taskId: task.id, points: task.points }),
      });

      const data = await response.json();

      if (response.status !== 200) {
        return;
      }

      // Mark the task as completed in the UI
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, completed: true } : task
        )
      );

      // Open the task link in a new tab
      window.open(path, "_blank");
    } catch (error) {
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

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="w-full mx-auto p-2 rounded-lg shadow-md overflow-y-scroll pb-80">
      <h2 className="text-xl font-semibold text-white mb-4">
        Earn for checking socials {tasks.filter((t) => t.completed).length}/
        {tasks.length}
      </h2>
      <div className="overflow-scroll max-h-[25rem] overflow-x-hidden w-full space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between bg-slate-600/15 p-3 rounded-lg"
          >
            <div>
              <div className="text-white font-semibold text-sm">
                {task.name}
              </div>
              <div className="text-xs"> +{task.points} COCKS</div>
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
