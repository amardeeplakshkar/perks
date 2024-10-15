"use client";
import { FaCoins, FaEquals } from "react-icons/fa";
import { MdFlipCameraAndroid } from "react-icons/md";
import { useEffect, useState } from "react";
import GameCard from "../../../components/GameCard";
import Img1 from "../../public/1.png";
import Img2 from "../../public/2.png";
import Img3 from "../../public/3.png";
import Img4 from "../../public/4.png";
import Img5 from "../../public/5.png";
import Img6 from "../../public/6.png";
import Img7 from "../../public/7.png";
import Img8 from "../../public/8.png";
import { useRouter } from "next/navigation"; // for routing

const cardImages = [
  { src: Img1, matched: true },
  { src: Img2, matched: true },
  { src: Img3, matched: true },
  { src: Img4, matched: true },
  { src: Img5, matched: true },
  { src: Img6, matched: true },
  { src: Img7, matched: true },
  { src: Img8, matched: true },
];

const GamePage = () => {
  const [cards, setCards] = useState([]);
  const [firstChoice, setFirstChoice] = useState(null);
  const [secondChoice, setSecondChoice] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [matches, setMatches] = useState(0);
  const [points, setPoints] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [user, setUser] = useState(null); // Store user data
  const router = useRouter();

  // Fetch user data on load
 
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


  // Shuffle cards and initialize state
  const shuffleCards = () => {
    const shuffled = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));
    setCards(shuffled);
    setFirstChoice(null);
    setSecondChoice(null);
    setAttempts(0);
    setMatches(0);
    setPoints(0);
    setGameComplete(false);
  };

  // Handle card selection
  const handleChoice = (card) => {
    if (firstChoice && firstChoice.id === card.id) return;
    firstChoice ? setSecondChoice(card) : setFirstChoice(card);
  };

  // Compare two selected cards
  useEffect(() => {
    if (firstChoice && secondChoice) {
      setDisabled(true);
      setAttempts((prev) => prev + 1);

      if (firstChoice.src === secondChoice.src) {
        setMatches((prev) => prev + 1);
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.src === firstChoice.src ? { ...card, matched: true } : card
          )
        );
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [firstChoice, secondChoice]);

  // Calculate points and check game completion
  useEffect(() => {
    if (attempts > 0) {
      const efficiency = Math.floor((matches / attempts) * 100);
      setPoints(efficiency * 10);
    }

    if (matches === cardImages.length) {
      setGameComplete(true); // Mark game complete
    }
  }, [matches, attempts]);

  // Reset the selected cards
  const resetTurn = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setDisabled(false);
  };

  // Send points to the backend and update user balance
  const handleClaim = async () => {
    if (!user) return;
  
    try {
      const response = await fetch("/api/add-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.telegramId, points }),
      });
  console.log(user, user.telegramId, points);
  
      if (response.ok) {
        router.push("/"); // Redirect after claiming
      } else {
        console.error("Failed to update points");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  // Shuffle cards on first render
  useEffect(() => {
    shuffleCards();
  }, []);

  return (
    <div className="container">
      <h1>Flip Game</h1>
      <div className="stats flex gap-5 pb-5">
        <div className="bg-slate-500/10 rounded-lg p-2 flex flex-col items-center gap-1">
          <MdFlipCameraAndroid size={20} />
          <p className="text-xs">Attempts</p>
          {attempts}
        </div>
        <div className="bg-slate-500/10 rounded-lg p-2 flex flex-col items-center gap-1">
          <FaEquals size={20} />
          <p className="text-xs">Matches</p>
          {matches}
        </div>
        <div className="bg-slate-500/10 rounded-lg p-2 flex flex-col items-center gap-1">
          <FaCoins size={20} />
          <p className="text-xs">Points</p>
          {points}
        </div>
      </div>

      <div className="cardGrid">
        {cards.map((card) => (
          <GameCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={
              card === firstChoice || card === secondChoice || card.matched
            }
            disabled={disabled}
          />
        ))}
      </div>

      {gameComplete && (
        <button
          onClick={handleClaim}
          className="mt-5 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
        >
          Claim Your Reward!
        </button>
      )}
    </div>
  );
};

export default GamePage;
