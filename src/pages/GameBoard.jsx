import React, { useEffect, useState } from "react";
import GameState from "../game/GameState";
import Deck from "../models/Deck";

import Pile from "../components/Pile";
import Stock from "../components/Stock";
import Foundation from "../components/Foundation";
import Tableau from "../components/Tableau";
import Controls from "../components/Controls";

const GameBoard = () => {
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    handleNewGame();
  }, []);

  function handleNewGame() {
    const deck = new Deck();
    deck.shuffle();
    const newGame = new GameState(deck);
    newGame.initializeGame();
    setGameState(newGame);
  }

  if (!gameState)
    return <div className="text-center text-white mt-20">Loading game...</div>;

  return (
    <div className="min-h-screen bg-green-700 p-6 text-white">
      <h1 className="text-3xl font-bold text-center mb-4">
        Klondike Solitaire
      </h1>

      {/* Upper Section: Stock + Foundations */}
      <div className="flex justify-between w-full max-w-6xl">
        <Stock cards={gameState.stock} />
        <div className="flex space-x-3">
          {Object.keys(gameState.foundation).map((suit) => (
            <Foundation
              key={suit}
              suit={suit}
              cards={gameState.foundation[suit]}
            />
          ))}
        </div>
      </div>

      <Tableau piles={gameState.tableau} />

      <Controls reset={() => handleNewGame(setGameState)} />
    </div>
  );
};


export default GameBoard;
