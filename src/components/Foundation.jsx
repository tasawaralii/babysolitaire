export default function Foundation({ suit, cards }) {
  const suitSymbol = {
    heart: "♥",
    diamond: "♦",
    club: "♣",
    spade: "♠",
  }[suit];

  const color =
    suit === "heart" || suit === "diamond" ? "text-red-400" : "text-black";

  return (
    <div className="w-20 h-28 bg-green-900 border-2 border-white rounded-lg flex flex-col items-center justify-center">
      <span className={`text-2xl ${color}`}>{suitSymbol}</span>
      <span className="text-xs mt-1">{cards.length}</span>
    </div>
  );
}
