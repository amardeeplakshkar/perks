"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { TrophySpin } from "react-loading-indicators";
import ChickenImg from "../app/giphy.gif";
import Logo from "../app/favicon.ico";
import Link from "next/link";
import Slider from "react-slick"; // Import slider package
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// Welcome slider component
// Welcome slider component
const WelcomeSlider = ({ onComplete }) => {
  const slides = [
    {
      title: "Welcome to the Community!",
      description: "We're glad to have you!",
    },
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
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Claim Welcome Points
      </button>
    </div>
  );
};
const Page = () => {
  const [user, setUser] = useState(null);
  const [showSlider, setShowSlider] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state for better user experience
  const [notification, setNotification] = useState("");

  // Fetch user data only once when the component mounts
  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      const initDataUnsafe = tg.initDataUnsafe || {};

      if (initDataUnsafe.user) {
        // Check if user exists in the backend and fetch points and status (hasClaimedWelcomePoints)
        fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(initDataUnsafe.user),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              setError(data.error);
            } else {
              setUser(data);
              // If the user has already claimed the points, do not show the slider
              if (data.hasClaimedWelcomePoints) {
                setShowSlider(false);
              } else {
                setShowSlider(true); // Show the welcome slider if the user is new
              }
            }
            setLoading(false); // Set loading to false once data is fetched
          })
          .catch((err) => {
            setError("Failed to fetch user data: " + err.message);
            setLoading(false);
          });
      } else {
        setError("No user data available");
        setLoading(false);
      }
    } else {
      setError("This app should be opened in Telegram");
      setLoading(false);
    }
  }, []);

  const handleCompleteTask = async () => {
    if (!user) return;

    try {
      const res = await fetch("/api/complete-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId: user.telegramId }),
      });
      const data = await res.json();
      if (data.success) {
        setUser((prev) => ({
          ...prev,
          points: data.points,
          taskCompleted: true,
        }));
        setNotification("Task completed successfully! You earned 200 points.");
      } else {
        setError(data.error || "Failed to complete task");
      }
    } catch (err) {
      setError("An error occurred while completing the task: " + err.message);
    }
  };

  const handleSliderComplete = () => {
    // Grant welcome points and mark user as not new anymore
    fetch("/api/welcome-points", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telegramId: user.telegramId,
        points: 500, // Change this value to the amount of points you want to grant
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json(); // Parse the JSON response
        }
        throw new Error("Failed to grant welcome points"); // Handle error if response is not ok
      })
      .then(() => {
        setShowSlider(false); // Hide the slider after completion
        setUser({ ...user, points: user.points + 500, isNewUser: false }); // Example of adding welcome points
      })
      .catch((err) => {
        console.error(err); // Log any errors
      });
  };

  const preventInteraction = (e) => {
    e.preventDefault();
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
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <main>
      {showSlider ? (
        <WelcomeSlider onComplete={handleSliderComplete} />
      ) : (
        // Main content starts here
        <div>
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

              <h3 className="p-2">@{user.username}</h3>

              <h3 className="text-xl font-bold pb-4">
                {user.points.toLocaleString()} COCKS
              </h3>
              <section className="rounded-lg w-full bg-white/10 p-3">
                <h4 className="uppercase font-bold">Cocks Community</h4>
                <p className="text-white/70 text-sm">
                  Community Of Telegram OGS
                </p>
                <Link href={"https://t.me/cocks_community"}>
                  <button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-0 text-black font-bold rounded-2xl px-3 py-1 mt-1 text-sm">
                    Join
                  </button>
                </Link>
              </section>
              <div className="absolute bottom-20 bg-slate-500 h-[6rem] w-full rounded-md m-1">
                <h3>
                  play to earn cocks
                  (Coming Soon) 
                </h3>
              </div>
            </div>
          </main>
        </div>
      )}
    </main>
  );
};

export default Page;
