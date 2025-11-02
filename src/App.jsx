import "./index.css";
import GameBoard from "./pages/GameBoard";
import Solitaire from "./pages/Solitaire";

function App() {

  return (
    <>
        <div className="min-h-screen bg-green-700 text-white font-sans">
          <GameBoard />
        </div>
      {/* <Solitaire /> */}
    </>
  );
}

export default App;
