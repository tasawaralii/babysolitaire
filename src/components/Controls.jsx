export default function Controls({reset}) {
  return (
    <div className="flex space-x-4 mt-4">
      <button onClick={reset} className="bg-white text-green-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">
        New Game
      </button>
      <button className="bg-white text-green-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">
        Undo
      </button>
    </div>
  );
}
