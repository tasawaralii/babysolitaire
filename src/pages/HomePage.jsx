import ThemeSelector from "../components/ThemeSelector";
import { useTheme } from "../context/ThemeContext";

const HomePage = ({ onStartGame, onShowSettings }) => {
  const {theme} = useTheme()
  return (
    <div className={`min-h-screen bg-linear-to-br ${theme.background} flex items-center justify-center p-6`}>
      <div className="text-center">
        <div className="absolute top-6 right-6">
          <ThemeSelector />
        </div>
        <div className="mb-8">
          <h1 className="text-7xl font-bold text-yellow-100 drop-shadow-2xl mb-4 animate-pulse">
            Baby Solitaire
          </h1>
          <p className="text-xl text-green-200 italic">
            Highly Customizable Solitaire Game
          </p>
        </div>

        <div className="flex justify-center gap-3 mb-12">
          {["♠", "♥", "♦", "♣"].map((suit, i) => (
            <div
              key={i}
              className="w-20 h-28 bg-white rounded-lg shadow-2xl flex items-center justify-center text-5xl transform hover:scale-110 transition-transform duration-300"
              style={{
                color: suit === "♥" || suit === "♦" ? "#dc2626" : "#000",
                animation: `float ${2 + i * 0.2}s ease-in-out infinite`,
              }}
            >
              {suit}
            </div>
          ))}
        </div>

        <div className="space-y-4 space-x-4">
          <button
            onClick={onStartGame}
            className="w-64 px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold text-xl rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            ▶️ Start Game
          </button>

          <button
            onClick={onShowSettings}
            className="w-64 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xl rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            ⚙️ Settings
          </button>
        </div>

        <p className="mt-12 text-green-300 text-sm">
          Baby Solitaire • Made with ❤️ by babyxboss
        </p>
      </div>

      <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
    </div>
  );
};

export default HomePage