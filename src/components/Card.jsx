export default function Card({ value, offset = 0 }) {
  return (
    <div
      className="w-20 h-28 bg-white border text-black rounded shadow flex items-center justify-center font-bold absolute"
      style={{ top: `${offset}px` }}
    >
      {value}
    </div>
  );
}
