"use client";
import { FaCoins, FaEquals } from "react-icons/fa";
import { MdFlipCameraAndroid } from "react-icons/md";
import { useEffect, useState } from "react";
import GameCard from "../../../components/GameCard";
import { useRouter } from "next/navigation"; // For routing

const cardImages = [
  { src: "/1.png", matched: false },
  { src: "/2.png", matched: false },
  { src: "/3.png", matched: false },
  { src: "/4.png", matched: false },
  { src: "/5.png", matched: false },
  { src: "/6.png", matched: false },
  { src: "/7.png", matched: false },
  { src: "/8.png", matched: false },
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
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch user data from Telegram on load
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
            if (data.error) setError(data.error);
            else setUser(data);
          })
          .catch((err) => setError("Failed to fetch user data: " + err.message));
      } else {
        setError("No user data available");
      }
    } else {
      setError("This app should be opened in Telegram.");
    }
  }, []);

  // Shuffle and initialize cards
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
    if (card.matched || (firstChoice && firstChoice.id === card.id)) return; // Prevent clicking matched cards or the same card twice
    firstChoice ? setSecondChoice(card) : setFirstChoice(card);
  };

  // Compare selected cards
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
        const timeout = setTimeout(() => resetTurn(), 1000);
        return () => clearTimeout(timeout); // Cleanup timeout
      }
    }
  }, [firstChoice, secondChoice]);

  // Calculate points and check if the game is complete
  useEffect(() => {
    if (attempts > 0) {
      const efficiency = Math.floor((matches / attempts) * 100);
      setPoints(efficiency * 10);
    }

    if (matches === cardImages.length) setGameComplete(true);
  }, [matches, attempts]);

  // Reset card selections
  const resetTurn = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setDisabled(false);
  };

  // Claim points and update user data
  const handleClaim = async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/add-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.telegramId, points }),
      });

      if (response.ok) router.push("/"); // Redirect after claiming points
      else console.error("Failed to update points");
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
        <StatBox icon={<MdFlipCameraAndroid size={20} />} label="Attempts" value={attempts} />
        <StatBox icon={<FaEquals size={20} />} label="Matches" value={matches} />
        <StatBox icon={<FaCoins size={20} />} label="Points" value={points} />
      </div>

      <div className="cardGrid">
        {cards.map((card) => (
          <GameCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === firstChoice || card === secondChoice || card.matched}
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

      {error && <p className="error">{error}</p>}
    </div>
  );
};

const StatBox = ({ icon, label, value }) => (
  <div className="bg-slate-500/10 rounded-lg p-2 flex flex-col items-center gap-1">
    {icon}
    <p className="text-xs">{label}</p>
    {value}
  </div>
);

export default GamePage;
