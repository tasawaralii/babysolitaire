import React, { createContext, useContext, useState, useEffect } from "react";

const THEMES = {
  classic: {
    name: "Classic Green",
    background: "from-green-700 via-green-800 to-green-900",
    cardBack: "from-green-600 to-green-800",
    cardBackBorder: "border-green-900",
    cardPattern: "bg-cyan-300",
    foundation: "bg-green-800 border-green-700",
    foundationHover: "bg-green-600 border-green-400",
    emptyPileBorder: "border-green-600",
    stockPile: "from-green-800 to-green-900 border-green-600",
    statsBar: "bg-green-900",
    hoverRing: "hover:border-green-400",
  },

  ocean: {
    name: "Ocean Blue",
    background: "from-cyan-700 to-cyan-900",
    cardBack: "from-cyan-600 to-cyan-800",
    cardBackBorder: "border-cyan-900",
    cardPattern: "bg-cyan-300",
    foundation: "bg-cyan-800 border-cyan-700",
    foundationHover: "bg-cyan-600 border-cyan-400",
    emptyPileBorder: "border-blue-600",
    stockPile: "from-cyan-800 to-cyan-900 border-cyan-600",
    statsBar: "bg-cyan-900",
    hoverRing: "hover:border-cyan-400",
  },

  sunset: {
    name: "Coral Sunset",
    background: "from-rose-400 via-orange-500 to-rose-600",
    cardBack: "from-orange-500 to-rose-700",
    cardBackBorder: "border-rose-800",
    cardPattern: "bg-amber-200",
    foundation: "bg-rose-700 border-rose-600",
    foundationHover: "bg-rose-500 border-orange-300",
    emptyPileBorder: "border-rose-500",
    stockPile: "from-rose-700 to-orange-800 border-rose-600",
    statsBar: "bg-rose-800",
    hoverRing: "hover:border-orange-300",
  },

  royal: {
    name: "Midnight Indigo",
    background: "from-indigo-700 via-indigo-800 to-slate-900",
    cardBack: "from-indigo-600 to-indigo-800",
    cardBackBorder: "border-indigo-950",
    cardPattern: "bg-indigo-300",
    foundation: "bg-indigo-900 border-indigo-700",
    foundationHover: "bg-indigo-600 border-indigo-400",
    emptyPileBorder: "border-indigo-700",
    stockPile: "from-indigo-800 to-slate-900 border-indigo-700",
    statsBar: "bg-indigo-950",
    hoverRing: "hover:border-indigo-400",
  },

  forest: {
    name: "Forest Dark",
    background: "from-emerald-800 via-teal-900 to-emerald-950",
    cardBack: "from-teal-700 to-teal-900",
    cardBackBorder: "border-teal-950",
    cardPattern: "bg-cyan-300",
    foundation: "bg-emerald-900 border-emerald-800",
    foundationHover: "bg-emerald-700 border-emerald-500",
    emptyPileBorder: "border-emerald-700",
    stockPile: "from-emerald-900 to-teal-950 border-emerald-700",
    statsBar: "bg-emerald-950",
    hoverRing: "hover:border-emerald-400",
  },

  // 🌟 New Yellow Theme
  golden: {
    name: "Golden Glow",
    background: "from-amber-300 via-yellow-400 to-amber-500",
    cardBack: "from-yellow-400 to-amber-500",
    cardBackBorder: "border-amber-700",
    cardPattern: "bg-yellow-200",
    foundation: "bg-amber-500 border-amber-600",
    foundationHover: "bg-amber-400 border-yellow-300",
    emptyPileBorder: "border-yellow-500",
    stockPile: "from-amber-400 to-amber-600 border-amber-500",
    statsBar: "bg-amber-600",
    hoverRing: "hover:border-yellow-300",
  },

  // 🧡 New Orange Theme
  ember: {
    name: "Ember Orange",
    background: "from-orange-600 via-amber-700 to-orange-800",
    cardBack: "from-orange-500 to-orange-700",
    cardBackBorder: "border-orange-900",
    cardPattern: "bg-amber-200",
    foundation: "bg-orange-700 border-orange-600",
    foundationHover: "bg-orange-500 border-amber-400",
    emptyPileBorder: "border-orange-600",
    stockPile: "from-orange-700 to-amber-800 border-orange-600",
    statsBar: "bg-orange-900",
    hoverRing: "hover:border-amber-400",
  },
};


const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("classic");

  useEffect(() => {
    const savedTheme = localStorage.getItem("solitaire-theme");
    if (savedTheme && THEMES[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("solitaire-theme", currentTheme);
  }, [currentTheme]);

  const theme = THEMES[currentTheme];

  const changeTheme = (themeName) => {
    if (THEMES[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  return (
    <ThemeContext.Provider
      value={{ theme, currentTheme, changeTheme, allThemes: THEMES }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export { THEMES };
