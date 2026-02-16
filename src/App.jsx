import { useEffect, useState } from "react";
import Board from "./components/Board";
import ConfigPanel from "./components/ConfigPanel";
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


      />
    );
  }

  if (pantalla === "board") {
    return (
      <Board
        volver={() => setPantalla("config")}
        config={config}
        progresoInicial={progreso}
      />
    );
  }

  return null;
}

export default App;
