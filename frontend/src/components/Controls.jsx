const Controls = ({
  reset,
  handleUndo,
  handleRedo,
  disableUndo,
  disableRedo,
  onBackToMenu,
  onShowHint,
}) => (
  <div className="flex gap-3 justify-center mt-12">
    <button
      onClick={onBackToMenu}
      className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold shadow-md transition-colors"
    >
      Home
    </button>
    <button
      onClick={reset}
      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-md transition-colors"
    >
      New Game
    </button>
    <button
      onClick={handleUndo}
      disabled={disableUndo}
      className="px-6 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold shadow-md transition-colors"
    >
      Undo
    </button>
    <button
      onClick={handleRedo}
      disabled={disableRedo}
      className="px-6 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold shadow-md transition-colors"
    >
      Redo
    </button>
    <button
      onClick={onShowHint}
      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-md transition-colors"
    >
      Show Hint
    </button>
  </div>
);

export default Controls