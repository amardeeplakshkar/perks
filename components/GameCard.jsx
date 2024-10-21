import React from "react";

const GameCard = ({ card, handleChoice, flipped, disabled }) => {
  const handleClick = () => {
    if (!disabled) handleChoice(card);
  };

  return (
    <div 
      className={`card bg-slate-500/50  rounded-lg cursor-pointer  ${
        flipped ? "flipped" : ""
      }`}
      onClick={handleClick}
    >
      {flipped ? (
        <img
          src={card.src}
          alt=""
          className="w-full h-full object-cover"
        />
      ) : (
        // Back side with plain background
        <div className="w-full h-full" />
      )}
    </div>
  );
};

export default GameCard;
