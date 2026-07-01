import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../api';
import LeaderboardTable from './LeaderboardTable'; // Import the new component

const LeaderboardModal = ({ isOpen, onClose }) => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            getLeaderboard()
                .then(data => {
                    setLeaderboard(data);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error("Error loading leaderboard:", err);
                    setIsLoading(false);
                });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full text-white border border-yellow-500">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-yellow-400">Top 10 Today</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl font-bold">×</button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
                    </div>
                ) : (
                    <LeaderboardTable leaderboard={leaderboard} /> 
                )}
                
                <button
                    onClick={onClose}
                    className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 rounded-lg transition-colors mt-2"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default LeaderboardModal;