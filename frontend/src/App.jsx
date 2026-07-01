import { useState } from "react";
import "./index.css";
import GameBoard from "./pages/GameBoard";
import HomePage from "./pages/HomePage";
import Challenge from "./pages/Challenge";
import SettingsModal from "./components/SettingsModal";
import constants from "./utils/constants";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  const { DEFAULT_SETTINGS } = constants;

  const [gameStarted, setGameStarted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [gameSettings, setGameSettings] = useState(DEFAULT_SETTINGS);

  const [challengeStarted, setChallengeStarted] = useState(false);

  const onStartGame = () => {
    setGameStarted(true);
  };
  
  const onStartChallenge = () => {
    setChallengeStarted(true);
  };

  const onBackToMenu = () => {
    setGameStarted(false);
    setChallengeStarted(false);
  };
  const onShowSettings = () => {
    setShowSettings(true);
  };

  const onSettingsSave = (newGameSettings) => {
    setGameSettings(newGameSettings);
    setGameStarted(true);
  };

  return (
    <>
      <ThemeProvider>
        <div className="relative min-h-screen bg-blue-700 text-white font-sans">
          {gameStarted ? (
            <GameBoard settings={gameSettings} onBackToMenu={onBackToMenu} />
          ) : challengeStarted ? (
            <Challenge onBackToMenu={onBackToMenu} settings={gameSettings} />
          ) : (
            <>
              <HomePage
                onStartGame={onStartGame}
                onStartChallenge={onStartChallenge}
                onShowSettings={onShowSettings}
              />
              {showSettings && (
                <SettingsModal
                  isOpen={showSettings}
                  onClose={() => setShowSettings(false)}
                  settings={gameSettings}
                  onSave={(newGameSettings) => onSettingsSave(newGameSettings)}
                />
              )}
            </>
          )}
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
