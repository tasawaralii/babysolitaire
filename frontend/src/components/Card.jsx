import { useTheme } from "../context/ThemeContext";

const Card = ({ card, isDraggable = false }) => {
  const { theme } = useTheme();
  const isRed = card.color === "red";

  return (
    <div
      // Made responsive: w-12 on mobile, w-16 on tablet, w-20 on desktop
      className={`relative w-12 sm:w-16 md:w-20 h-15 sm:h-24 md:h-28 rounded-md sm:rounded-lg border-[1px] sm:border-2 transition-all duration-300 ${
        card.faceUp
          ? "bg-white border-gray-300 shadow-md hover:shadow-lg cursor-pointer"
          : `bg-linear-to-br ${theme.cardBack} ${theme.cardBackBorder}`
      } ${isDraggable ? "hover:-translate-y-1 sm:hover:-translate-y-1.5" : ""}`}
      style={{
        boxShadow: card.faceUp
          ? "0 2px 8px rgba(0,0,0,0.15)"
          : "0 1px 3px rgba(0,0,0,0.3)",
      }}
    >
      {card.faceUp ? (
        <>
          <div
            className={`absolute top-0.5 sm:top-1 left-1 sm:left-1.5 font-bold leading-none ${
              isRed ? "text-red-600" : "text-gray-900"
            }`}
          >
            {/* Scaled text sizes */}
            <div className="text-[10px] sm:text-base">{card.value}</div>
            <div className="text-xs sm:text-lg -mt-0.5">{card.suit}</div>
          </div>
          <div
            className={`absolute inset-0 flex items-center justify-center text-xl sm:text-4xl ${
              isRed ? "text-red-600" : "text-gray-900"
            }`}
          >
            {card.suit}
          </div>
          <div
            className={`absolute bottom-0.5 sm:bottom-1 right-1 sm:right-1.5 font-bold leading-none transform rotate-180 ${
              isRed ? "text-red-600" : "text-gray-900"
            }`}
          >
            <div className="text-[10px] sm:text-base">{card.value}</div>
            <div className="text-xs sm:text-lg -mt-0.5">{card.suit}</div>
          </div>
        </>
      ) : (
        <div className={`w-full h-full rounded sm:rounded-lg bg-linear-to-br ${theme.cardBack} p-1 sm:p-2 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-4 gap-[1px] sm:gap-1 w-full h-full p-0.5 sm:p-1">
              {[...Array(20)].map((_, i) => (
                <div key={i} className={`${theme.cardPattern} rounded-sm`} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;