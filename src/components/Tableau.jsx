import Pile from "./Pile";

export default function Tableau({ piles }) {
  return (
    <div className="flex justify-center space-x-3 mt-8">
      {piles.map((pile, index) => (
        <Pile key={index} index={index + 1} cards={pile} />
      ))}
    </div>
  );
}
