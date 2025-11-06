import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const ThemeSelector = () => {
  const { theme, currentTheme, changeTheme, allThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${theme.statsBar} px-4 py-2 rounded-lg shadow-md flex items-center gap-2 hover:opacity-80 transition-opacity`}
      >
        🎨 {theme.name}
        <span className="text-xs">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute top-full mt-2 right-0 bg-gray-900 rounded-lg shadow-2xl border-2 border-gray-700 overflow-hidden z-50 min-w-[200px]">
            {Object.entries(allThemes).map(([key, themeOption]) => (
              <button
                key={key}
                onClick={() => {
                  changeTheme(key);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors flex items-center gap-3 ${
                  currentTheme === key
                    ? "bg-gray-800 border-l-4 border-yellow-500"
                    : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded bg-gradient-to-r ${themeOption.background} border-2 border-gray-600`}
                />
                <span className="text-white font-semibold">
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

export default ThemeSelector