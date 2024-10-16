import React from 'react'
import gify from "../app/public/1.png"
import Image from "next/image"

const GameCard = ({ card, handleChoice, flipped, disabled }) => {
    const handleClick = () => {
        if (!disabled) {
          handleChoice(card);
        }
      };
      const preventInteraction = (e) => {
        e.preventDefault();
      };
    
     
      return (
        <div className="card">
          <div className={flipped ? "flipped" : ""}>
            <Image className="bg-slate-500/10
             front" src={card.src} alt="card front" />
            <image
              className="back no-interaction"
              src={gify}
              alt="card backword"
              onContextMenu={preventInteraction}
              onTouchStart={preventInteraction}
              draggable={false}
              onClick={handleClick}
            />
          </div>
        </div>
      );
    }
    
export default GameCard