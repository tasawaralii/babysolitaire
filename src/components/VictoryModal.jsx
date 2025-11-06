import React from 'react';

const VictoryModal = ({ isOpen, score, moves, time, onNewGame, onBackToMenu }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-green-700 to-green-900 p-8 rounded-xl shadow-2xl transform animate-bounce-once">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-yellow-300 mb-6">
            🎉 Congratulations! 🎉
          </h2>
          <div className="space-y-4 text-white text-xl mb-8">
            <p>You've completed the game!</p>
            <div className="space-y-2">
              <p>Final Score: {score} points</p>
              <p>Moves Made: {moves}</p>
              <p>
                Time: {Math.floor(time / 60)}:{("0" + (time % 60)).slice(-2)}
              </p>
            </div>
          </div>
          <div className="space-x-4">
            <button
              onClick={onNewGame}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={onBackToMenu}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VictoryModal;