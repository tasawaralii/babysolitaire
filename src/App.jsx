import { useState } from "react";
import "./index.css";
import GameBoard from "./pages/GameBoard";
import HomePage from "./pages/HomePage";
import SettingsModal from "./components/SettingsModal";
import constants from "./utils/constants";

function App() {

  const {DEFAULT_SETTINGS} = constants

  const [gameStarted, setGameStarted] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [gameSettings, setGameSettings] = useState(DEFAULT_SETTINGS);

  const onStartGame = () => {
    setGameStarted(true)
  }

  const onBackToMenu = () => {
    setGameStarted(false)
  }
  const onShowSettings = () => {
    setShowSettings(true)
  }

  const onSettingsSave = (newGameSettings) => {
    setGameSettings(newGameSettings)
    setGameStarted(true)
  }

  return (
    <>
      <div className="min-h-screen bg-blue-700 text-white font-sans">
        {gameStarted ? (
          <GameBoard settings={gameSettings} onBackToMenu={onBackToMenu} />
        ) : (
          <>
            <HomePage
              onStartGame={onStartGame}
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
    </>
  );
}

export default App;
