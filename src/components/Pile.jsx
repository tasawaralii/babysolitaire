import CardView from "./CardView";

export default function Pile({ index, cards }) {
  // console.log(cards)
  return (
    <div className="w-20 bg-green-900 border-2 border-white rounded-lg flex flex-col items-center pt-1 pb-2">
      <span className="text-xs mb-1">Pile {index}</span>
      <div className="flex flex-col space-y-1">
        {cards.map((card, i) => (
          <CardView key={i} card={card} />
        ))}
      </div>
    </div>
  );
}
