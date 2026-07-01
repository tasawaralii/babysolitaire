import React from 'react';
import CardDraggable from './CardDraggable';
import { useTheme } from '../context/ThemeContext';

const Stock = ({ stock, currentWindow, draw, hint }) => {
  const { theme } = useTheme();

  return (

    <div className="flex gap-2 sm:gap-4 items-center">
      <div
        className={`relative w-12 sm:w-16 md:w-20 h-16 sm:h-24 md:h-28 bg-linear-to-br ${theme.stockPile} border-[1px] sm:border-2 rounded-md sm:rounded-lg flex items-center justify-center cursor-pointer hover:border-yellow-500 transition-colors shadow-lg`}
        onClick={draw}
      >
        <div className="text-center font-semibold">
          {stock.size() > 0 || currentWindow.length > 0 ? (
            <div>

              <div className="text-xl sm:text-2xl mb-0.5 sm:mb-1">🂠</div>
              <div className="text-[10px] sm:text-xs">{stock.size()}</div>
            </div>
          ) : (
            <div className="text-[8px] sm:text-xs text-yellow-300">REDEAL </div>
          )}
        </div>
      </div>


      <div className="flex -space-x-8 sm:-space-x-12 md:space-x-2">        {currentWindow.map((card, i) => (
        <CardDraggable
          key={i}
          card={card}
          cardSource="waste"
          sourceIdx={i}
          cardIdx={i}
          isHinted={hint && hint.source === "waste" && hint.sourceIdx === i}
        />
      ))}
      </div>
    </div>
  );
}

export default Stock;