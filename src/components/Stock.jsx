import React from 'react'
import CardDraggable from './CardDraggable';

const Stock = ({stock, currentWindow, draw, hint}) => {
  return (
    <div className="flex gap-4 items-center">
      <div
        className="w-20 h-28 bg-linear-to-br from-green-800 to-green-900 border-2 border-green-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-yellow-500 transition-colors shadow-lg"
        onClick={draw}
      >
        <div className="text-center text-xs font-semibold">
          {stock.size() > 0 || currentWindow.length > 0 ? (
            <div>
              <div className="text-2xl mb-1">🂠</div>
              <div>{stock.size()}</div>
            </div>
          ) : (
            <div className="text-yellow-300">REDEAL </div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {currentWindow.map((card, i) => (
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

export default Stock