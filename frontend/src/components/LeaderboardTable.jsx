import React from 'react';

const formatTime = (seconds) => {
    return `${Math.floor(seconds / 60)}:${("0" + (seconds % 60)).slice(-2)}`;
};

const LeaderboardTable = ({ leaderboard, currentUsername }) => {
    if (!leaderboard || leaderboard.length === 0) {
        return (
            <div className="p-8 text-center text-gray-400">
                No scores yet today. Be the first!
            </div>
        );
    }

    return (
        <div className="max-h-64 overflow-y-auto mb-4 custom-scrollbar">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-700 sticky top-0 z-10">
                    <tr>
                        <th className="p-3 rounded-tl-lg">Rank</th>
                        <th className="p-3">Name</th>
                        <th className="p-3">Time</th>
                        <th className="p-3 rounded-tr-lg">Moves</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.map((entry, index) => {
                        const isCurrent = entry.username === currentUsername;
                        
                        return (
                            <tr 
                                key={index} 
                                className={`border-b border-gray-700 hover:bg-gray-600 transition-colors ${
                                    isCurrent ? 'bg-gray-700 text-yellow-400 font-bold' : ''
                                }`}
                            >
                                <td className="p-3 font-bold text-yellow-500">#{index + 1}</td>
                                <td className="p-3 truncate max-w-[100px]">{entry.username}</td>
                                <td className="p-3 font-mono">{formatTime(entry.time)}</td>
                                <td className="p-3">{entry.moves}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default LeaderboardTable;