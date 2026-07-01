import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const SettingsModal = ({ isOpen, onClose, onSave, settings }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const { currentTheme } = useTheme();

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn flex items-center justify-center z-50 p-3 sm:p-4">
      <div
        className={`bg-linear-to-br ${currentTheme.background} rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-8 border-4 ${currentTheme.cardBackBorder}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-3xl font-bold text-yellow-100">
            ⚙️ Game Settings
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-red-400 text-2xl sm:text-3xl font-bold leading-none"
          >
            ×
          </button>
        </div>
        {/* Settings Content */}
        <div className="space-y-4 sm:space-y-6">
          {/* Draw Settings */}
          <div
            className={`${currentTheme.foundation} rounded-lg p-3 sm:p-5 border-2`}
          >
            <h3 className="text-base sm:text-xl font-bold text-yellow-300 mb-3 sm:mb-4">
              🎴 Draw Settings
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-white font-semibold mb-2 block text-sm sm:text-base">
                  Cards to Draw from Stock:
                </label>

                <input
                  type="range"
                  min="1"
                  max="7"
                  step="1"
                  value={localSettings.drawCount}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      drawCount: Number(e.target.value),
                    })
                  }
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-yellow-400 bg-black/30"
                />

                <p className="text-yellow-300 text-base sm:text-lg font-bold text-center mt-2">
                  Draw {localSettings.drawCount}{" "}
                  {localSettings.drawCount === 1 ? "card" : "cards"}
                </p>

                <p className="text-white/70 text-xs sm:text-sm mt-1 text-center">
                  Customize the number of Cards draw at a time
                </p>
              </div>
            </div>
          </div>

          {/* Scoring Settings */}
          <div
            className={`${currentTheme.foundation} rounded-lg p-3 sm:p-5 border-2`}
          >
            <h3 className="text-base sm:text-xl font-bold text-yellow-300 mb-3 sm:mb-4">
              ⭐ Scoring
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-white text-sm sm:text-base">
                  Waste to Tableau:
                </span>
                <input
                  type="number"
                  min={1}
                  value={localSettings.scoring.wasteToTableau}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      scoring: {
                        ...localSettings.scoring,
                        wasteToTableau: parseInt(e.target.value),
                      },
                    })
                  }
                  className={`w-16 sm:w-20 px-2 sm:px-3 py-1 bg-black/30 text-white text-sm sm:text-base rounded border ${currentTheme.emptyPileBorder}`}
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-white text-sm sm:text-base">
                  Waste to Foundation:
                </span>
                <input
                  type="number"
                  min={1}
                  value={localSettings.scoring.wasteToFoundation}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      scoring: {
                        ...localSettings.scoring,
                        wasteToFoundation: parseInt(e.target.value),
                      },
                    })
                  }
                  className={`w-16 sm:w-20 px-2 sm:px-3 py-1 bg-black/30 text-white text-sm sm:text-base rounded border ${currentTheme.emptyPileBorder}`}
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-white text-sm sm:text-base">
                  Tableau to Tableau:
                </span>
                <input
                  type="number"
                  min={1}
                  value={localSettings.scoring.tableauToTableau}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      scoring: {
                        ...localSettings.scoring,
                        tableauToTableau: parseInt(e.target.value),
                      },
                    })
                  }
                  className={`w-16 sm:w-20 px-2 sm:px-3 py-1 bg-black/30 text-white text-sm sm:text-base rounded border ${currentTheme.emptyPileBorder}`}
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-white text-sm sm:text-base">
                  Tableau to Foundation:
                </span>
                <input
                  type="number"
                  min={1}
                  value={localSettings.scoring.tableauToFoundation}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      scoring: {
                        ...localSettings.scoring,
                        tableauToFoundation: parseInt(e.target.value),
                      },
                    })
                  }
                  className={`w-16 sm:w-20 px-2 sm:px-3 py-1 bg-black/30 text-white text-sm sm:text-base rounded border ${currentTheme.emptyPileBorder}`}
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-white text-sm sm:text-base">
                  Foundation to Tableau:
                </span>
                <input
                  type="number"
                  max={1}
                  value={localSettings.scoring.foundationToTableau}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      scoring: {
                        ...localSettings.scoring,
                        foundationToTableau: parseInt(
                          e.target.value < 0 ? e.target.value : 0
                        ),
                      },
                    })
                  }
                  className={`w-16 sm:w-20 px-2 sm:px-3 py-1 bg-black/30 text-white text-sm sm:text-base rounded border ${currentTheme.emptyPileBorder}`}
                />
              </div>
            </div>
          </div>

          {/* Game Rules */}
          <div
            className={`${currentTheme.foundation} rounded-lg p-3 sm:p-5 border-2`}
          >
            <h3 className="text-base sm:text-xl font-bold text-yellow-300 mb-3 sm:mb-4">
              📋 Game Rules
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3 text-white cursor-pointer text-sm sm:text-base">
                <input
                  type="checkbox"
                  checked={localSettings.countUndoRedo}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      countUndoRedo: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded shrink-0"
                />
                <span>Count Undo/Redo as Moves</span>
              </label>

              <label className="flex items-center gap-3 text-white cursor-pointer text-sm sm:text-base">
                <input
                  type="checkbox"
                  checked={localSettings.timedGame}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      timedGame: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded shrink-0"
                />
                <span>Timed Game</span>
              </label>
            </div>
          </div>

          {/* Difficulty Preset */}
          <div
            className={`${currentTheme.foundation} rounded-lg p-3 sm:p-5 border-2`}
          >
            <h3 className="text-base sm:text-xl font-bold text-yellow-300 mb-3 sm:mb-4">
              🎯 Difficulty Presets
            </h3>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() =>
                  setLocalSettings({
                    ...localSettings,
                    drawCount: 7,
                    countUndoRedo: false,
                  })
                }
                className="flex-1 px-2 sm:px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm sm:text-base rounded-lg font-semibold"
              >
                Easy
              </button>
              <button
                onClick={() =>
                  setLocalSettings({
                    ...localSettings,
                    drawCount: 3,
                    countUndoRedo: false,
                  })
                }
                className="flex-1 px-2 sm:px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white text-sm sm:text-base rounded-lg font-semibold"
              >
                Medium
              </button>
              <button
                onClick={() =>
                  setLocalSettings({
                    ...localSettings,
                    drawCount: 1,
                    countUndoRedo: true,
                  })
                }
                className="flex-1 px-2 sm:px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm sm:text-base rounded-lg font-semibold"
              >
                Hard
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-lg shadow-lg transition-all order-1"
          >
            Save & Start Game
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-lg transition-all order-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;