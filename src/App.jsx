import { useEffect, useState } from "react";
import Board from "./components/Board";
import ConfigPanel from "./components/ConfigPanel";
import ScoreControl from "./components/ScoreControl";
import ScoreDisplay from "./components/ScoreDisplay";
import "./App.css";

function App() {
  const [pantalla, setPantalla] = useState("config");
  const [config, setConfig] = useState(null);
  const [progreso, setProgreso] = useState(null);

  // 🔹 Restaurar partida automáticamente
  useEffect(() => {
    const partidaGuardada = localStorage.getItem("jeopardyPartida");

    if (partidaGuardada) {
      const data = JSON.parse(partidaGuardada);
      setConfig(data.config);
      setProgreso(data.progreso);
      setPantalla("board");
    }
  }, []);

  // 🔹 CONFIG
  if (pantalla === "config") {
    return (
      <ConfigPanel
        onStart={(datosConfig) => {
          const partidaGuardada = localStorage.getItem("jeopardyPartida");

          let progresoGuardado = {};

          if (partidaGuardada) {
            const data = JSON.parse(partidaGuardada);
            progresoGuardado = data.progreso || {};
          }

          setConfig(datosConfig);
          setProgreso(progresoGuardado);
          setPantalla("board");
        }}
        irAScoreControl={() => setPantalla("score-control")}
      />
    );
  }

  // 🔹 BOARD
  if (pantalla === "board") {
    return (
      <Board
        volver={() => setPantalla("config")}
        config={config}
        progresoInicial={progreso}
        irAPuntajes={() => setPantalla("score-display")}
      />
    );
  }

  // 🔹 SCORE CONTROL (operador)
  if (pantalla === "score-control") {
  return (
    <ScoreControl
      volverAlJuego={() => setPantalla("config")}
    />
  );
}

  if (pantalla === "score-display") {
    return (
      <ScoreDisplay
        volverAlJuego={() => setPantalla("board")}
      />
    );
  }

  return null;
}

export default App;