const Card = ({ card }) => {
  const isRed = card.color === "red";

  return (
    <div
      className={`relative w-20 h-28 rounded-lg border-2 transition-all duration-200 ${
        card.faceUp
          ? "bg-white border-gray-300 shadow-md hover:shadow-lg cursor-pointer"
          : "bg-linear-to-br from-blue-600 to-blue-800 border-blue-900"
      }`}
      style={{
        boxShadow: card.faceUp
          ? "0 2px 8px rgba(0,0,0,0.15)"
          : "0 1px 3px rgba(0,0,0,0.3)",
      }}
    >
      {card.faceUp ? (
        <>
          {/* Top left corner */}
          <div
            className={`absolute top-1 left-1.5 text-sm font-bold leading-none ${
              isRed ? "text-red-600" : "text-gray-900"
            }`}
          >
            <div className="text-base">{card.value}</div>
            <div className="text-lg -mt-0.5">{card.suit}</div>
          </div>

          {/* Center suit */}
          <div
            className={`absolute inset-0 flex items-center justify-center text-4xl ${
              isRed ? "text-red-600" : "text-gray-900"
            }`}
          >
            {card.suit}
          </div>

          {/* Bottom right corner (rotated) */}
          <div
            className={`absolute bottom-1 right-1.5 text-sm font-bold leading-none transform rotate-180 ${
              isRed ? "text-red-600" : "text-gray-900"
            }`}
          >
            <div className="text-base">{card.value}</div>
            <div className="text-lg -mt-0.5">{card.suit}</div>
          </div>
        </>
      ) : (
        <div className="w-full h-full rounded-lg bg-linear-to-br from-blue-700 to-blue-900 p-2 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-4 gap-1 w-full h-full p-1">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="bg-blue-300 rounded-sm" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Card;