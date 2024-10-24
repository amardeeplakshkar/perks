"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import Next.js router for navigation
import Image from "next/image";
import { TonConnectButton } from "@tonconnect/ui-react";
import Loader from "./Loader";
import { toast } from "react-toastify";

const Page = () =>
{
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialize Next.js router

  useEffect(() =>
  {
    if (typeof window !== "undefined" && window.Telegram?.WebApp)
    {
      const tg = window.Telegram.WebApp;
      tg.ready();

      const initDataUnsafe = tg.initDataUnsafe || {};

      if (initDataUnsafe.user)
      {
        fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(initDataUnsafe.user),
        })
          .then((res) => res.json())
          .then((data) =>
          {
            console.log("User data received:", data);
            if (data.error)
            {
              setError(data.error);
              toast.error(data.error); // Show toast for error
              if (data.error === "Internal server error")
              {
                tg.close(); // Close the mini app on internal server error
              }
            } else
            {
              setUser(data || {});
              if (!data.hasClaimedWelcomePoints)
              {
                router.push("/welcome"); // Redirect to /welcome if points not claimed
              }
            }
            setLoading(false);
          })
          .catch((err) =>
          {
            const errorMsg = "Failed to fetch user data: " + err.message;
            setError(errorMsg);
            toast.error(errorMsg); // Show toast for fetch error
            if (err.message === "Internal server error")
            {
              tg.close(); // Close the mini app on internal server error
            }
            setLoading(false);
          });
      } else
      {
        const noUserError = "No user data available";
        setError(noUserError);
        toast.error(noUserError); // Show toast for no user data
        setUser({});
        setLoading(false);
      }
    } else
    {
      const appError = "This app should be opened in Telegram";
      setError(appError);
      toast.error(appError); // Show toast for app error
      setLoading(false);
    }

    if (typeof window !== "undefined")
    {
      const links = document.querySelectorAll("[data-href]");
      links.forEach((link) =>
      {
        link.addEventListener("click", (e) =>
        {
          e.preventDefault();
          const href = link.getAttribute("data-href");
          if (href)
          {
            window.open(href, "_self");
          }
        });
      });

      return () =>
      {
        links.forEach((link) =>
        {
          link.removeEventListener("click", () => { });
        });
      };
    }
  }, [router]);

  const handlePlayGame = async () =>
  {
    if (!user) return;
    router.push('/game');

    try
    {
      const response = await fetch("/api/play-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId: user.telegramId }),
      });

      const data = await response.json();

      if (response.ok)
      {
        setUser((prev) => ({
          ...prev,
          points: prev.points - 100,
          dailyPlays: prev.dailyPlays + 1,
        }));
        toast.success("Game started! 100 points deducted."); // Show success toast
      } else
      {
        const errorMsg = data.error || "You have reached the daily limit of 3 plays.";
        setError(errorMsg);
        toast.error(errorMsg); // Show toast for game start error
      }
    } catch (err)
    {
      const errorMsg = "An error occurred: " + err.message;
      setError(errorMsg);
      toast.error(errorMsg); // Show toast for catch error
    }
  };

  if (loading)
  {
    return <Loader />;
  }

  if (error)
  {
    return <div className="p-4 mx-auto text-red-500">{error}</div>;
  }

  return (
    <main>
      <div className="p-3">
        <div className="flex flex-col items-center justify-center">
          <TonConnectButton />
          <Image
            src="https://res.cloudinary.com/duscymcfc/image/upload/f_auto,q_auto/v1/Cocks/logo"
            alt="Community Logo"
            height={150}
            width={150}
            className="no-interaction"
            onContextMenu={(e) => e.preventDefault()}
            onTouchStart={(e) => e.preventDefault()}
            draggable={false}
          />
          <h3 className="p-2">@{user?.username || "Guest"}</h3>
          <h3 className="pb-4 text-xl font-bold">
            {user?.points?.toLocaleString() || 0} COCKS
          </h3>
          <section className="w-full p-3 rounded-lg bg-white/10">
            <h4 className="font-bold uppercase">Cocks Community</h4>
            <p className="text-sm text-white/70">Community Of Telegram OGS</p>
            <div data-href={"https://t.me/cocks_community"}>
              <button className="px-3 py-1 mt-1 text-sm font-bold text-black border-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl">
                Join
              </button>
            </div>
          </section>
          <div className="absolute bottom-[5rem] h-[6rem] w-full">
            <button
              onClick={handlePlayGame}
              disabled={user?.dailyPlays >= 3 || user?.points < 100}
              className={`gameButton relative h-full w-full rounded-md m-1 flex justify-center items-center font-bold mt-4 px-4 py-2 ${user?.dailyPlays >= 3 || user?.points < 100
                ? "bg-gray-400 cursor-not-allowed"
                : " hover:bg-green-600 text-white"
                }`}
            >
              <span className="absolute top-0 p-2 rounded-md right-1 bg-amber-500">
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
