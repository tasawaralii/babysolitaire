import React, { useState } from 'react';
import { submitChallengeScore } from '../api';
import LeaderboardTable from '../components/LeaderboardTable';

const ChallengeVictoryModal = ({ isOpen, score, moves, time, onBackToMenu }) => {
    const [username, setUsername] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [leaderboard, setLeaderboard] = useState(null);

    if (!isOpen) return null;

    const formatTime = (seconds) => {
        return `${Math.floor(seconds / 60)}:${("0" + (seconds % 60)).slice(-2)}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim()) return;

        setIsSubmitting(true);
        try {
            // Send to FastAPI
            const topScores = await submitChallengeScore({
                challenge_id: "iteration-1-unshuffled",
                username: username,
                time: time,
                moves: moves,
                score: score
            });
            
            setLeaderboard(topScores);
        } catch (error) {
            console.error("Failed to submit score:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full text-white border border-yellow-500">
                <h2 className="text-3xl font-bold text-yellow-400 text-center mb-6">
                    {leaderboard ? "Daily Leaderboard" : "Challenge Complete!"}
                </h2>

                {!leaderboard ? (
                    <>
                        <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                            <div className="bg-gray-700 p-3 rounded-lg">
                                <p className="text-gray-400 text-sm">Time</p>
                                <p className="text-xl font-bold">{formatTime(time)}</p>
                            </div>
                            <div className="bg-gray-700 p-3 rounded-lg">
                                <p className="text-gray-400 text-sm">Moves</p>
                                <p className="text-xl font-bold">{moves}</p>
                            </div>
                            <div className="bg-gray-700 p-3 rounded-lg">
                                <p className="text-gray-400 text-sm">Score</p>
                                <p className="text-xl font-bold">{score}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="mb-6">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Enter your name for the leaderboard:
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500 mb-4"
                                placeholder="e.g., CodeNinja99"
                                maxLength={15}
                                required
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 rounded-lg transition-colors"
                            >
                                {isSubmitting ? "Submitting..." : "Post Score"}
                            </button>
                        </form>
                    </>
                ) : (

                    <div className="mb-6">
                        <LeaderboardTable 
                            leaderboard={leaderboard} 
                            currentUsername={username}
                        />
                    </div>
                )}

                <div className="flex gap-4">
                    
                    <button
                        onClick={onBackToMenu}
                        className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 rounded-lg transition-colors"
                    >
                        Back to Menu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChallengeVictoryModal;