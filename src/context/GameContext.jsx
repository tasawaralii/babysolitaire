import { useContext, useState } from "react";
import GameState from "../game/GameState";

const GameContext = useContext(null);
export const useGame = () => useContext(GameContext);

export const GameProvider = ({children}) => {

    const [gameState, setGameState] = useState(() => {

    })

    const [version, setVersion] = useState(0)

    const updateGame = (updater) => {
        setGameState((prev) => {
            const updated = new GameState()
        })
    }

    return (
        <GameContext.Provider v
        alue={{}} >
            {children}
        </GameContext.Provider>
    )
}