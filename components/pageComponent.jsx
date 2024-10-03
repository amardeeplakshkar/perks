"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { TrophySpin } from "react-loading-indicators";
import ChickenImg from "../app/giphy.gif";
import Logo from "../app/favicon.ico";
import Link from "next/link";

const PageComponent = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      const initDataUnsafe = tg.initDataUnsafe || {};

      if (initDataUnsafe.user) {
        fetch("/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(initDataUnsafe.user),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              setError(data.error);
            } else {
              setUser(data);
            }
          })
          .catch((err) => {
            setError("Failed to fetch user data: " + err);
          });
      } else {
        setError("No user data available");
      }
    } else {
      setError("This app should be opened in Telegram");
    }
  }, []);

  const handleCompleteTask = async () => {
    if (!user) return;

    try {
      const res = await fetch("/api/complete-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ telegramId: user.telegramId }), // Send telegramId to mark task as completed
      });
      const data = await res.json();
      if (data.success) {
        setUser({ ...user, points: data.points, taskCompleted: true }); // Update user points and mark task as completed
        setNotification("Task completed successfully! You earned 200 points.");
      } else {
        setError(data.error || "Failed to complete task"); // Show error message if the task is already completed
      }
    } catch (err) {
      setError("An error occurred while completing the task: " + err);
    }
  };

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  if (!user)
    return (
      <div className="flex gap-2 flex-col justify-center items-center min-h-svh bg-white">
        <Image src={ChickenImg} alt="chicken" width={150} height={150} />
        <div className="w-4em">
          <TrophySpin color="#32cd32" size="medium" text="" textColor="" />
        </div>
      </div>
    );
  const preventInteraction = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <main className="p-3">
        <div className="flex flex-col justify-center items-center">
          <Image
            src={Logo}
            alt="Community Logo"
            height={150}
            width={150}
            className="no-interaction"
            onContextMenu={preventInteraction}
            onTouchStart={preventInteraction}
            draggable={false}
          />
          <h3 className="text-xl font-bold pb-4">
            {user.points.toLocaleString()} COCKS
          </h3>
          <section className="rounded-lg w-full bg-white/10 p-3">
            <h4 className="uppercase font-bold">Cocks Community</h4>
            <p className="text-white/70 text-sm">Community Of Telegram OGS</p>
            <Link href={"https://t.me/cocks_community"}>
              <button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-0 text-black font-bold rounded-2xl px-3 py-1 mt-1 text-sm">
                Join
              </button>
            </Link>
          </section>
          <section className="w-full p-3">
            <h3 className="font-bold">Your Rewards</h3>
            <div className="flex flex-col">
              <div className="card flex justify-between items-center w-full py-2">
                <div className="flex justify-center items-center gap-2">
                  <span className="h-[2rem] aspect-square bg-white/10 flex justify-center items-center rounded-full">
                    0
                  </span>
                  <h4 className="text-sm font-bold">Reward</h4>
                </div>
                <p className="font-bold">+X COCKS</p>
              </div>
              <div className="card flex justify-between items-center w-full py-2">
                <div className="flex justify-center items-center gap-2">
                  <span className="h-[2rem] aspect-square bg-white/10 flex justify-center items-center rounded-full">
                    0
                  </span>
                  <h4 className="text-sm font-bold">Reward</h4>
                </div>
                <p className="font-bold cursor-pointer">+X COCKS</p>
                {notification && (
                  <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
                    {notification}
                  </div>
                )}
                <div className="mt-4">
                  <h2 className="text-xl font-semibold">
                    Task: Join the community!
                  </h2>
                  <p className="mb-2">Complete the task to earn 200 points.</p>
                  <a
                    href="https://t.me/cocks_community"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button
                      onClick={handleCompleteTask}
                      disabled={user.taskCompleted} // Disable the button if the task is completed
                      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                        user.taskCompleted
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {user.taskCompleted ? "Task Completed" : "Complete Task"}
                    </button>
                  </a>
                </div>

                {notification && (
                  <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
                    {notification}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
      {/* <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.firstName}!</h1>
      <p>Your current points: {user.points}</p>

      
    </div> */}
    </>
  );
};

export default PageComponent;
