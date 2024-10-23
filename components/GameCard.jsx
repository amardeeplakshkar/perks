import Image from "next/image";
import React from "react";

const GameCard = ({ card, handleChoice, flipped, disabled }) =>
{
  const handleClick = () =>
  {
    if (!disabled) handleChoice(card);
  };

  return (
    <div
      className={`card bg-slate-500/50  rounded-lg cursor-pointer  ${flipped ? "flipped" : ""
        }`}
      onClick={handleClick}
    >
      {flipped ? (
        <Image
          src={card.src}
          alt="cocks"
          className="object-cover w-full h-full"
          width={100}
          height={100}
          priority
        />
      ) : (
        // Back side with plain background
        <div className="w-full h-full" />
      )}
    </div>
  );
};

export default GameCard;
