"use client";

import React, { useEffect, useState } from "react";
import Card from "../../../components/Card";
import useUserData from "../../../components/hooks/useUserData";
import Loader from "../../../components/Loader"
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
        const response = await fetch("/api/leaderboard");
        if (!response.ok) {
          throw new Error("Failed to fetch top users");
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

  const getRankEmoji = (index) => {
    switch (index) {
      case 0:
        return "🥇"; // 1st place emoji
      case 1:
        return "🥈"; // 2nd place emoji
      case 2:
        return "🥉"; // 3rd place emoji
      default:
        return `#${index + 1}`; // Rank number for others
    }
  };

  if (userLoading || loadingTopUsers) {
    return (
      <Loader/>
    );
  }

  if (error) {
    return <div className=" mx-auto p-4 text-red-500">{error}</div>;
  }

  if (!user) {
    return (
      <Loader/>
    );
  }

  return (
    <main className="flex flex-col justify-center items-center p-2">
      <h2 className="text-2xl font-bold py-2">Wall Of Frame</h2>
      <div className="w-full py-4">
        <Card
          bg={"bg-white/10"}
          rank="⭐" // Current user's rank symbol (or adjust as needed)
          amount={user.points} // Current user's points
          username={user.firstName || "🐓Cocks User"}
        />
        {notification && <p className="text-green-500">{notification}</p>}
      </div>
      <h3 className="place-self-start font-bold text-xl">Top Users</h3>
      <div className="flex-grow overflow-y-auto max-h-[calc(100vh-40vh)] w-full overflow-x-hidden">
        {topUsers.map((topUser, index) => (
          <Card
            key={topUser.telegramId}
            rank={getRankEmoji(index)}
            amount={topUser.points}
            username={topUser.firstName || "Anonymous"}
          />
        ))}
      </div>
    </main>
  );
};

export default Leaderboard;
