import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const ThemeSelector = () => {
  const { theme, currentTheme, changeTheme, allThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${theme.statsBar} px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-md flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity`}
      >
        <span>🎨</span>
        <span className="hidden sm:inline">{theme.name}</span>
        <span className="text-xs">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 right-0 bg-gray-900 rounded-lg shadow-2xl border-2 border-gray-700 overflow-hidden z-50 min-w-[180px] sm:min-w-[200px] max-w-[calc(100vw-2rem)]">
            {Object.entries(allThemes).map(([key, themeOption]) => (
              <button
                key={key}
                onClick={() => {
                  changeTheme(key);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 text-left hover:bg-gray-800 transition-colors flex items-center gap-2 sm:gap-3 ${
                  currentTheme === key
                    ? "bg-gray-800 border-l-4 border-yellow-500"
                    : ""
                }`}
              >
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 shrink-0 rounded bg-gradient-to-r ${themeOption.background} border-2 border-gray-600`}
                />
                <span className="text-white font-semibold text-sm sm:text-base">
                  {themeOption.name}
                </span>
                {currentTheme === key && (
                  <span className="ml-auto text-yellow-500">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;