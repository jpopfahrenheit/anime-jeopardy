import { useState } from "react";
import Board from "./components/Board";

function App() {
  const [pantalla, setPantalla] = useState("config");

  if (pantalla === "config") {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>Jeopardy Anime 🎌</h1>
        <button
          style={{ fontSize: "20px", padding: "10px 20px" }}
          onClick={() => setPantalla("board")}
        >
          Comenzar Juego
        </button>
      </div>
    );
  }

  if (pantalla === "board") {
    return <Board volver={() => setPantalla("config")} />;
  }
}

export default App;
