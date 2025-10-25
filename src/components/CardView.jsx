import React from 'react'
import Card from '../models/Card'

const CardView = ({card}) => {
  return (
    <div
      className={`w-16 h-8 rounded-md border ${card.faceUp ? "cursor-pointer" : ""} text-center text-sm ${
        card.faceUp
          ? `bg-white text-${card.color == "red" ? "red-400" : "black"}`
          : "bg-blue-900 text-blue-900"
      }`}
    >
      {card.faceUp ? `${card.rank}${getSuitSymbol(card.suit)}` : ""}
    </div>
  );
}


function getSuitSymbol(suit) {
  return { heart: "♥", diamond: "♦", club: "♣", spade: "♠" }[suit];
}

export default CardView