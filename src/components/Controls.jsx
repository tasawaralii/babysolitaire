export default function Controls({reset, handleRedo, handleUndo, disableUndo, disableRedo}) {
  return (
    <div className="flex justify-center space-x-4 mt-6">
      <button
        onClick={reset}
        className="bg-white text-green-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
      >
        New Game
      </button>
      <button
        className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700"
        onClick={handleUndo}
        disabled={disableUndo}
      >
        Undo
      </button>

      <button
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        onClick={handleRedo}
        disabled={disableRedo}
      >
        Redo
      </button>
    </div>
  );
}
