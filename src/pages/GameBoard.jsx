import React, { useEffect, useState } from "react";
import { DndContext} from "@dnd-kit/core";
import Pile from "../components/Pile";
import Foundation from "../components/Foundation";
import Controls from "../components/Controls";
import GameState from "../game/GameState";
import constants from "../utils/constants";
import Stock from "../components/Stock"

const {SUITS} = constants

const GameBoard = ({ onBackToMenu, settings }) => {
  const {
    moveCardToDestination,
    score,
    moves,
    draw,
    stock,
    currentWindow,
    tableaus,
    foundations,
    handleNewGame,
    handleRedo,
    handleUndo,
    findHint,
    undoPossible,
    redoPossible,
  } = GameState(settings);

  const [time, setTime] = useState(0);
  const [hint, setHint] = useState(null)

  useEffect(() => {
    handleNewGame();
    const timeInterval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  
  function handleShowHint() {
    const foundHint = findHint();
    setHint(foundHint);

    setTimeout(() => {
      setHint(null);
    }, 2000);
  }


  const cardDragEnd = (event) => {
    if (!event.over) return;
    const sourceCard = event.active.data.current.card;
    const source = event.active.data.current.cardSource;
    const cardIdx = event.active.data.current.cardIdx;
    const sourceIdx = event.active.data.current.sourceIdx;
    const destination = event.over.data.current.destination;
    const destinationIdx = event.over.data.current.destinationIdx;

    if (source === destination && sourceIdx === destinationIdx) return;

    moveCardToDestination(
      source,
      destination,
      sourceIdx,
      destinationIdx,
      cardIdx,
      sourceCard
    );
  };

  return (
    <DndContext onDragEnd={cardDragEnd}>
      <div className="min-h-screen bg-linear-to-br from-green-700 via-green-800 to-green-900 p-6 text-white">
        {/* Header */}
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-6 text-yellow-100 drop-shadow-lg">
            Baby Solitaire
          </h1>

          {/* Stats Bar */}
          <div className="flex justify-center gap-8 mb-6 text-lg font-semibold">
            <div className="bg-green-900 px-4 py-2 rounded-lg shadow-md">
              ⏱️ {Math.floor(time / 60)}:{("0" + (time % 60)).slice(-2)}
            </div>
            <div className="bg-green-900 px-4 py-2 rounded-lg shadow-md">
              🎯 Moves: {moves}
            </div>
            <div className="bg-green-900 px-4 py-2 rounded-lg shadow-md">
              ⭐ Score: {score}
            </div>
          </div>

          {/* Top Row: Stock/Waste and Foundations */}
          <div className="flex justify-between items-start mb-8 max-w-6xl mx-auto">
            {/* Stock and Waste */}

            <Stock stock={stock} currentWindow={currentWindow} draw={draw} hint={hint} />

            {/* Foundations */}
            <div className="flex gap-3">
              {foundations.map((foundation, i) => (
                <Foundation
                  key={i}
                  index={i}
                  suit={SUITS[i]}
                  foundation={foundation}
                  hint={hint}
                />
              ))}
            </div>
          </div>

          {/* Tableau */}
          <div className="flex justify-center gap-4 mb-6">
            {tableaus.map((pile, i) => (
              <Pile key={i} pile={pile} pileIdx={i} hint={hint} />
            ))}
          </div>

          {hint && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg shadow-2xl font-bold animate-bounce z-50">
              💡 {hint.message}
            </div>
          )}

          {/* Controls */}
          <Controls
            reset={() => {
              setTime(0);
              handleNewGame();
            }}
            handleRedo={handleRedo}
            handleUndo={handleUndo}
            disableRedo={!redoPossible}
            disableUndo={!undoPossible}
            onBackToMenu={onBackToMenu}
            onShowHint={handleShowHint}
          />
        </div>
      </div>
    </DndContext>
  );
};

export default GameBoard;