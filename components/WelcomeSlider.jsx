"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { TrophySpin } from "react-loading-indicators";
import ChickenImg from "../app/giphy.gif";
import Logo from "../app/favicon.ico";
import Slider from "react-slick"; // Import slider package
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import Address from "../components/Address"


const WelcomeSlider = ({ onComplete }) => {
  const slides = [
    { title: "Welcome to the Community!", description: "We're glad to have you!" },
    { title: "Earn Points", description: "Complete tasks and earn rewards!" },
    { title: "Get Started", description: "Let's start earning those points!" },
  ];

  return (
    <div className="welcome-slider">
      <Slider
        dots={true}
        infinite={false}
        speed={500}
        slidesToShow={1}
        slidesToScroll={1}
      >
        {slides.map((slide, index) => (
          <div key={index}>
            <h3>{slide.title}</h3>
            <p>{slide.description}</p>
          </div>
        ))}
      </Slider>
      <button
        onClick={onComplete}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex justify-center items-center"
      >
        Claim Welcome Points{" "}
        <img
          src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Smileys/Partying%20Face.webp"
          alt="Partying Face"
          width="25"
          height="25"
          className="no-interaction"
          onContextMenu={(e) => e.preventDefault()}
          onTouchStart={(e) => e.preventDefault()}
          draggable={false}
        />
      </button>
    </div>
  );
};

const Page = () => {
  const [user, setUser] = useState(null);
  const [showSlider, setShowSlider] = useState(false);
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
            console.log("User data received:", data); // Log the user data
            if (data.error) {
              setError(data.error);
            } else {
              setUser(data || {}); // Set user data or fallback to empty object
              setShowSlider(!data.hasClaimedWelcomePoints);
            }
            setLoading(false);
          })
          .catch((err) => {
            setError("Failed to fetch user data: " + err.message);
            setLoading(false);
          });
      } else {
        setError("No user data available");
        setUser({}); // Fallback to empty object
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
          link.removeEventListener("click", () => { });
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
    return (
      <div className="flex gap-2 flex-col justify-center items-center min-h-screen bg-white">
        <Image src={ChickenImg} alt="Loading" width={150} height={150} />
        <TrophySpin color="#32cd32" size="medium" />
      </div>
    );
  }

  if (error) {
    return <div className="mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <main>
      {showSlider ? (
        <WelcomeSlider onComplete={() => setShowSlider(false)} />
      ) : (
        <div>
          <main className="p-3">
            <div className="flex flex-col justify-center items-center">
              <Link href="/wallet" className="cursor-pointer user-none">
                <Address />
              </Link>
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
                  className={`gameButton relative h-full w-full rounded-md m-1 flex justify-center items-center font-bold mt-4 px-4 py-2 ${user?.dailyPlays >= 3 || user?.points < 100
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
          </main>
        </div>
      )}
    </main>
  );
};

export default Page;