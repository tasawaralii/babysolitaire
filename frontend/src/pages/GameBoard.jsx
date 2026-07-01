import React, { useEffect, useState } from "react";
import { DndContext, useSensor, useSensors, MouseSensor, TouchSensor } from "@dnd-kit/core";
import Pile from "../components/Pile";
import Foundation from "../components/Foundation";
import Controls from "../components/Controls";
import GameState from "../game/GameState";
import constants from "../utils/constants";
import Stock from "../components/Stock"
import ThemeSelector from "../components/ThemeSelector"
import VictoryModal from "../components/VictoryModal";
import { useTheme } from "../context/ThemeContext";
const { SUITS } = constants

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
    checkWinCondition,
    undoPossible,
    redoPossible,
  } = GameState(settings);

  const [showVictory, setShowVictory] = useState(false);
  const [time, setTime] = useState(0);
  const [winTime, setWinTime] = useState(0);
  const [hint, setHint] = useState(null)
  const { theme } = useTheme();

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

    if (checkWinCondition()) {
      setWinTime(time)
      setShowVictory(true);
    }
  };

  const handleNewGameWithReset = () => {
    setTime(0);
    setWinTime(0);
    setShowVictory(false);
    handleNewGame();
  };

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150, 
        tolerance: 5, 
      },
    })
  );

  return (
    <DndContext onDragEnd={cardDragEnd} sensors={sensors}>

      <div className={`min-h-screen bg-linear-to-br ${theme.background} p-2 sm:p-6 text-white overflow-x-hidden`}>
        <div className="max-w-7xl mx-auto">
          

         <h1 className="text-3xl sm:text-4xl md:text-5xl font-chewy tracking-wide text-center mb-4 sm:mb-6 text-yellow-100 drop-shadow-lg">
            Baby Solitaire
          </h1>


          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-8 mb-4 sm:mb-6 text-xs sm:text-sm md:text-lg font-semibold px-1">
            <div className={`${theme.statsBar} px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-md flex items-center`}>
              ⏱️ {Math.floor(time / 60)}:{("0" + (time % 60)).slice(-2)}
            </div>
            <div className={`${theme.statsBar} px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-md flex items-center`}>
              🎯 Moves: {moves}
            </div>
            <div className={`${theme.statsBar} px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-md flex items-center`}>
              ⭐ Score: {score}
            </div>
            <ThemeSelector />
          </div>

          <div className="flex flex-wrap justify-center sm:justify-between items-start gap-y-4 mb-6 sm:mb-8 max-w-6xl mx-auto px-1">
            <Stock
              stock={stock}
              currentWindow={currentWindow}
              draw={draw}
              hint={hint}
            />


            <div className="flex ml-2 gap-1 sm:gap-2 md:gap-3">
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


          <div className="flex justify-center gap-1 sm:gap-2 md:gap-4 mb-6 px-1">
            {tableaus.map((pile, i) => (
              <Pile key={i} pile={pile} pileIdx={i} hint={hint} />
            ))}
          </div>

          {hint && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg shadow-2xl font-bold animate-bounce z-50 text-sm sm:text-base text-center w-11/12 max-w-md">
              💡 {hint.message}
            </div>
          )}

          <Controls
            reset={handleNewGameWithReset}
            handleRedo={handleRedo}
            handleUndo={handleUndo}
            disableRedo={!redoPossible}
            disableUndo={!undoPossible}
            onBackToMenu={onBackToMenu}
            onShowHint={handleShowHint}
          />
        </div>

        <VictoryModal
          isOpen={showVictory}
          score={score}
          moves={moves}
          time={winTime}
          onNewGame={handleNewGameWithReset}
          onBackToMenu={onBackToMenu}
        />
      </div>
    </DndContext>
  );
};

export default GameBoard;