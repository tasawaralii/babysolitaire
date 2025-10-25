import { useState } from "react";
import "./index.css";
import GameBoard from "./pages/GameBoard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="min-h-screen bg-green-700 text-white font-sans">
        <GameBoard />
      </div>
    </>
  );
}

export default App;
