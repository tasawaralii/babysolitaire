import ThemeSelector from "../components/ThemeSelector";
import { useTheme } from "../context/ThemeContext";

const HomePage = ({ onStartGame, onStartChallenge }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`relative min-h-screen bg-linear-to-br ${theme.background} flex items-center justify-center p-4 sm:p-6`}
    >
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeSelector />
      </div>

      <div className="text-center w-full max-w-md">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-yellow-100 drop-shadow-2xl mb-3 sm:mb-4 animate-pulse leading-tight">
            Baby Solitaire
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-green-200 italic">
            Highly Customizable Solitaire Game
          </p>
        </div>

        <div className="flex justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          {["♠", "♥", "♦", "♣"].map((suit, i) => (
            <div
              key={i}
              className="w-14 h-20 sm:w-20 sm:h-28 bg-white rounded-lg shadow-2xl flex items-center justify-center text-3xl sm:text-5xl transform hover:scale-110 transition-transform duration-300"
              style={{
                color: suit === "♥" || suit === "♦" ? "#dc2626" : "#000",
                animation: `float ${2 + i * 0.2}s ease-in-out infinite`,
              }}
            >
              {suit}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <button
            onClick={onStartGame}
            className="w-full max-w-xs px-6 py-3 sm:px-8 sm:py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold text-base sm:text-xl rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            ▶️ Start Game
          </button>
          <button
            onClick={onStartChallenge}
            className="w-full max-w-xs px-6 py-3 sm:px-8 sm:py-4 bg-green-500 hover:bg-green-400 text-gray-900 font-bold text-base sm:text-xl rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            🎯 Daily Challenge
          </button>
        </div>

        <p className="mt-8 sm:mt-12 text-green-300 text-xs sm:text-sm">
          BabySolitaire • Made with <a href="https://github.com/tasawaralii" className="underline hover:text-yellow-300">Tasawar Ali</a>
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

export default HomePage;