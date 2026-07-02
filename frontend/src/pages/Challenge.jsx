import React, { useEffect, useState } from "react";
import { DndContext, useSensor, useSensors, MouseSensor, TouchSensor } from "@dnd-kit/core";
import Pile from "../components/Pile";
import Foundation from "../components/Foundation";
import Controls from "../components/Controls";
import GameState from "../game/GameState";
import constants from "../utils/constants";
import Stock from "../components/Stock"
import ThemeSelector from "../components/ThemeSelector"
import ChallengeVictoryModal from "../components/ChallengeVictoryModal";
import LeaderboardModal from "../components/LeaderboardModal";
import { useTheme } from "../context/ThemeContext";
import { getDailyChallenge } from "../api";

const { SUITS } = constants

const Challenge = ({ onBackToMenu, settings }) => {
    const {
        moveCardToDestination,
        score,
        moves,
        draw,
        stock,
        currentWindow,
        tableaus,
        foundations,
        handleChallenge,
        handleRedo,
        handleUndo,
        findHint,
        checkWinCondition,
        undoPossible,
        redoPossible,
    } = GameState(settings);

    const [showVictory, setShowVictory] = useState(false);
    const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
    const [challengeLoaded, setChallengeLoaded] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Fetching today's challenge...");

    const [time, setTime] = useState(0);
    const [winTime, setWinTime] = useState(0);
    const [hint, setHint] = useState(null)
    const { theme } = useTheme();

    const fetchDailyChallenge = async () => {
        try {
            const challengeData = await getDailyChallenge();
            handleChallenge(challengeData);
            setChallengeLoaded(true);

        } catch (error) {
            console.error('Error fetching daily challenge:', error);
        }
    }

    useEffect(() => {
        fetchDailyChallenge()
    }, []);

    useEffect(() => {
        if (challengeLoaded) return;

        setLoadingMessage("Fetching today's challenge...");

        const timeouts = [
            setTimeout(() => setLoadingMessage("Shuffling the deck..."), 3000),
            setTimeout(() => setLoadingMessage("Waking up the backend server (this might take up to 30s)..."), 7000),
            setTimeout(() => setLoadingMessage("Verifying winnability with A* Search Algorithm..."), 15000),
            setTimeout(() => setLoadingMessage("Almost there, arranging the tableau..."), 25000)
        ];

        return () => timeouts.forEach(clearTimeout);
    }, [challengeLoaded]);

    useEffect(() => {
        if (!challengeLoaded) return;
        const timeInterval = setInterval(() => {
            setTime((prev) => prev + 1);
        }, 1000);
        return () => {
            if (timeInterval) {
                clearInterval(timeInterval);
            }
        };
    }, [challengeLoaded])

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
        setChallengeLoaded(false);
        fetchDailyChallenge();
    };

    // Added mobile touch sensors!
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
            {/* MATCHED GameBoard.jsx: p-2 sm:p-6 overflow-x-hidden */}
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


                        <button
                            onClick={() => setShowLeaderboardModal(true)}
                            className="bg-yellow-600 hover:bg-yellow-500 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-md transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base"
                        >
                            <span>🏆</span>
                            <span className="hidden sm:inline">Leaderboard</span>
                        </button>

                        <ThemeSelector />
                    </div>

                    {!challengeLoaded ?
                        <div className="flex flex-col justify-center items-center h-64 gap-4 px-4 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-yellow-500"></div>
                            <span className="text-sm sm:text-lg font-semibold text-yellow-100 animate-pulse">
                                {loadingMessage}
                            </span>
                        </div>
                        :
                        <>
                           
                           
                            <div className="flex w-full justify-between items-start mb-6 sm:mb-8 max-w-6xl mx-auto px-1 sm:px-2">

                                <Stock
                                    stock={stock}
                                    currentWindow={currentWindow}
                                    draw={draw}
                                    hint={hint}
                                />


                                <div className="flex gap-1 sm:gap-2 md:gap-3">
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
                        </>
                    }

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

                <ChallengeVictoryModal
                    isOpen={showVictory}
                    score={score}
                    moves={moves}
                    time={winTime}
                    onNewGame={handleNewGameWithReset}
                    onBackToMenu={onBackToMenu}
                />

                <LeaderboardModal
                    isOpen={showLeaderboardModal}
                    onClose={() => setShowLeaderboardModal(false)}
                />
            </div>
        </DndContext>
    );
};

export default Challenge;