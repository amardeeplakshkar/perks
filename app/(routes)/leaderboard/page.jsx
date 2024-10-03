"use client";

import React, { useEffect, useState } from "react";
import Card from "../../../components/Card";
import useUserData from "../../../components/hooks/useUserData";
import Image from 'next/image'; // Ensure you import Image if using Next.js Image component
import { TrophySpin } from "react-loading-indicators";
import ChickenImg from "../../../app/giphy.gif"

const Leaderboard = () => {
  const { loading: userLoading } = useUserData();
  const [topUsers, setTopUsers] = useState([]);
  const [loadingTopUsers, setLoadingTopUsers] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const response = await fetch('/api/leaderboard');
        if (!response.ok) {
          throw new Error('Failed to fetch top users');
        }
        const data = await response.json();
        setTopUsers(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoadingTopUsers(false);
      }
    };

    fetchTopUsers();
  }, []);

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
            setError("Failed to fetch user data: " + err.message);
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
        body: JSON.stringify({ telegramId: user.telegramId }),
      });
      const data = await res.json();
      if (data.success) {
        setUser((prevUser) => ({
          ...prevUser,
          points: data.points, // Assuming data.points is the updated points
          taskCompleted: true
        }));
        setNotification("Task completed successfully! You earned 200 points.");
      } else {
        setError(data.error || "Failed to complete task");
      }
    } catch (err) {
      setError("An error occurred while completing the task: " + err.message);
    }
  };

  if (userLoading || loadingTopUsers) {
    return (
      <div className="flex gap-2 flex-col justify-center items-center min-h-svh bg-white">
      <Image src={ChickenImg} alt="chicken" width={150} height={150}/>
      <div className="w-4em">
      <TrophySpin color="#32cd32" size="medium" text="" textColor="" />
      </div>
    </div>
    );
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  if (!user) {
    return (
      <div className="flex gap-2 flex-col justify-center items-center min-h-svh bg-white">
        <Image src={ChickenImg} alt="chicken" width={150} height={150} />
        <div className="w-4em">
          <TrophySpin color="#32cd32" size="medium" text="" textColor="" />
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col justify-center items-center p-2">
      <h2 className="text-2xl font-bold py-2">Wall Of Frame</h2>
      <div className="w-full py-4">
        <Card
          bg={"bg-white/10"}
          rank="⭐" // Change this based on your logic to determine the user's rank
          amount={user.points} // Set this to the current user's points
          username={user.username || 'N/A'}
        />
        {notification && <p className="text-green-500">{notification}</p>} {/* Display notification */}
      </div>
      <h3 className="place-self-start font-bold text-xl">Top Users</h3>
      <div className="flex flex-col space-y-2 w-full">
        {topUsers.map((topUser, index) => (
          <Card key={topUser.telegramId} rank={`#${index + 1}`} amount={topUser.points} username={topUser.username} />
        ))}
      </div>
    </main>
  );
};

export default Leaderboard;
