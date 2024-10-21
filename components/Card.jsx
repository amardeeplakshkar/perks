import React from "react";

const getRandomBrightColorClass = () => {
  const brightColors = [
    "bg-yellow-500",
    "bg-green-400",
    "bg-pink-500",
    "bg-blue-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-teal-400",
    "bg-orange-500",
  ];
  return brightColors[Math.floor(Math.random() * brightColors.length)];
};

const Card = ({ username = "Cocks User", amount, rank, bg, telegramId }) => {
  const randomColorClass = getRandomBrightColorClass();
  const profileImageUrl = `https://api.ratingtma.com/cdn/user/${telegramId}`;

  return (
    <div
      className={`flex justify-between items-center p-2 rounded-lg w-full m-1 ${bg}`}
    >
      <div className="flex justify-center items-center gap-2">
        <div
          className={`h-[3rem] w-[3rem] aspect-square rounded-full bg-cover bg-center ${randomColorClass}`}
          style={{ backgroundImage: `url(${profileImageUrl})` }}
        />
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
