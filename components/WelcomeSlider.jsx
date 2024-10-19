"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Logo from "../app/favicon.ico";
import { TonConnectButton } from "@tonconnect/ui-react";
import Loader from "./Loader";
import { toast } from "react-toastify";

const Page = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      const initDataUnsafe = tg.initDataUnsafe || {};

      if (initDataUnsafe.user) {
        fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(initDataUnsafe.user),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("User data received:", data);
            if (data.error) {
              setError(data.error);
            } else {
              setUser(data || {}); // Set user data or fallback to empty object
            }
            setLoading(false);
          })
          .catch((err) => {
            setError("Failed to fetch user data: " + err.message);
            setLoading(false);
          });
      } else {
        setError("No user data available");
        setUser({});
        setLoading(false);
      }
    } else {
      setError("This app should be opened in Telegram");
      setLoading(false);
    }

    if (typeof window !== "undefined") {
      const links = document.querySelectorAll("[data-href]");
      links.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const href = link.getAttribute("data-href");
          if (href) {
            window.open(href, "_self");
          }
        });
      });

      return () => {
        links.forEach((link) => {
          link.removeEventListener("click", () => {});
        });
      };
    }
  }, []);

  const handlePlayGame = async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/play-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId: user.telegramId }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser((prev) => ({
          ...prev,
          points: prev.points - 100,
          dailyPlays: prev.dailyPlays + 1,
        }));
        setNotification("Game started! 100 points deducted.");
      } else {
        setError(data.error || "You have reached the daily limit of 3 plays.");
      }
    } catch (err) {
      setError("An error occurred: " + err.message);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <main>
      <div className="p-3">
        <div className="flex flex-col justify-center items-center">
          <TonConnectButton />
          <Image
            src={Logo}
            alt="Community Logo"
            height={150}
            width={150}
            className="no-interaction"
            onContextMenu={(e) => e.preventDefault()}
            onTouchStart={(e) => e.preventDefault()}
            draggable={false}
          />
          <h3 className="p-2">@{user?.username || "Guest"}</h3>
          <h3 className="text-xl font-bold pb-4">
            {user?.points?.toLocaleString() || 0} COCKS
          </h3>
          <section className="rounded-lg w-full bg-white/10 p-3">
            <h4 className="uppercase font-bold">Cocks Community</h4>
            <p className="text-white/70 text-sm">Community Of Telegram OGS</p>
            <div data-href={"https://t.me/cocks_community"}>
              <button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-0 text-black font-bold rounded-2xl px-3 py-1 mt-1 text-sm">
                Join
              </button>
            </div>
          </section>
          <div className="absolute bottom-[5rem] h-[6rem] w-full" data-href="/game">
            <button
              onClick={handlePlayGame}
              disabled={user?.dailyPlays >= 3 || user?.points < 100}
              className={`gameButton relative h-full w-full rounded-md m-1 flex justify-center items-center font-bold mt-4 px-4 py-2 ${
                user?.dailyPlays >= 3 || user?.points < 100
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              <span className="absolute top-0 right-1 bg-amber-500 rounded-md p-2">
                Played: {user?.dailyPlays || 0}/3
              </span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
