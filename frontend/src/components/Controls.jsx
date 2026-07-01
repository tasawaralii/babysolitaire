import { useTheme } from "../context/ThemeContext";

const Controls = ({
  reset,
  handleUndo,
  handleRedo,
  disableUndo,
  disableRedo,
  onBackToMenu,
  onShowHint,
}) => {
  const { theme } = useTheme();


  const buttonStyle = `${theme.statsBar} px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg shadow-md flex items-center gap-1.5 hover:opacity-80 transition-opacity`;

  return (

    <div className="flex flex-col gap-3 sm:gap-4 mt-8 sm:mt-12 mb-6 px-1">
      

      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-8 text-sm sm:text-base md:text-xl font-semibold">
        <button
          className={buttonStyle}
          onClick={onBackToMenu}
        >
          <span>🏠</span>
          <span>Home</span>
        </button>

        <button
          className={buttonStyle}
          onClick={reset}
        >
          <span>🔄</span>
          <span>New Game</span>
        </button>

        <button
          className={buttonStyle}
          onClick={onShowHint}
        >
          <span>💡</span>
          <span>Hint</span>
        </button>
      </div>


      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-8 text-sm sm:text-base md:text-xl font-semibold">
        <button
          onClick={handleUndo}
          disabled={disableUndo}
          className={`${buttonStyle} disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:opacity-50`}
        >
          <span>↩️</span>
          <span>Undo</span>
        </button>

        <button
          onClick={handleRedo}
          disabled={disableRedo}
          className={`${buttonStyle} disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:opacity-50`}
        >
          <span>↪️</span>
          <span>Redo</span>
        </button>
      </div>

    </div>
  );
};

export default Controls;