import { useState } from "react";
import Board from "./components/Board";
import ConfigPanel from "./components/ConfigPanel";
import "./App.css";

function App() {
  const [pantalla, setPantalla] = useState("config");
  const [config, setConfig] = useState(null);

  if (pantalla === "config") {
    return (
      <ConfigPanel
        onStart={(datosConfig) => {
          setConfig(datosConfig);
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
      />
    );
  }
}

export default App;
