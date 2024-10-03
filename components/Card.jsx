import React from "react";

// Function to select a random bright Tailwind color
const getRandomBrightColorClass = () => {
  const brightColors = [
    "bg-yellow-500", 
    "bg-green-400", 
    "bg-pink-500", 
    "bg-blue-500", 
    "bg-red-500", 
    "bg-purple-500", 
    "bg-teal-400", 
    "bg-orange-500"
  ];
  return brightColors[Math.floor(Math.random() * brightColors.length)];
};

const Card = ({ username = "Cocks User", amount, rank, bg }) => {
  const randomColorClass = getRandomBrightColorClass(); // Get a random bright color class for the initials background

  return (
    <div
      className={`card flex justify-between items-center w-full p-2 rounded-lg m-1 ${bg}`}
    >
      <div className="flex justify-center items-center gap-2">
        <span
          className={`h-[3rem] text-black font-bold aspect-square flex justify-center items-center rounded-full uppercase ${randomColorClass}`}
        >
          {username.slice(0, 2)} {/* Shows the first 2 letters of the username */}
        </span>
        <div>
          <h4 className="text-sm font-bold">{username}</h4>
          {amount !== undefined && (
            <h4 className="text-white/70 text-sm font-bold">{`${amount} COCKS`}</h4>
          )}
        </div>
      </div>
      <p className="font-bold">{rank}</p>
    </div>
  );
};

export default Card;
