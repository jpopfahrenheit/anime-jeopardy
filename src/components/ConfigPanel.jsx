import { useEffect, useState } from "react";

export default function ConfigPanel({ onStart, irAScoreControl }) {
  const [nombreJuego, setNombreJuego] = useState("Jornadas del Manga y el Anime");
  const [sets, setSets] = useState([]);
  const [setSeleccionado, setSetSeleccionado] = useState("");
  const [timerDuracion, setTimerDuracion] = useState(15);

  // 🔹 Cargar sets.json al iniciar
  useEffect(() => {
    fetch("/preguntas/sets.json")
      .then((res) => res.json())
      .then((data) => {
        setSets(data);
        if (data.length > 0) {
          setSetSeleccionado(data[0].id);
        }
      })
      .catch((err) => {
        console.error("Error cargando sets:", err);
      });
  }, []);

  const iniciarPartida = () => {
    if (!setSeleccionado) return;

    onStart({
      nombreJuego,
      archivoPreguntas: setSeleccionado,
      timerDuracion: timerDuracion || 15
    });
  };

  return (
    <div className="app-center">

      <h1 className="app-title">Configuración del Juego</h1>

      {/* Nombre del Juego */}
      <div style={{ marginBottom: "20px" }}>
        <label>Nombre del juego:</label><br />
        <input
          type="text"
          value={nombreJuego}
          onChange={(e) => setNombreJuego(e.target.value)}
          style={{ padding: "8px", width: "250px", marginTop: "5px" }}
        />
      </div>

      {/* Set de Preguntas */}
      <div style={{ marginBottom: "20px" }}>
        <label>Set de preguntas:</label><br />
        <select
          value={setSeleccionado}
          onChange={(e) => setSetSeleccionado(e.target.value)}
          style={{ padding: "8px", width: "250px", marginTop: "5px" }}
        >
          {sets.map((set) => (
            <option key={set.id} value={set.id}>
              {set.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Duración del Timer */}
      <div style={{ marginBottom: "20px" }}>
        <label>Duración del timer (segundos):</label><br />
        <input
          type="number"
          min="5"
          max="60"
          value={timerDuracion}
          onChange={(e) => setTimerDuracion(Number(e.target.value))}
          style={{ padding: "8px", width: "100px", marginTop: "5px" }}
        />
      </div>

      {/* Botón Iniciar */}
      <button
        className="btn-large"
        onClick={iniciarPartida}
        disabled={!setSeleccionado}
      >
        🎮 Iniciar Partida
      </button>

      {/* Control de Puntajes */}
      <button
        className="btn-large"
        style={{ marginTop: "15px", backgroundColor: "#444" }}
        onClick={irAScoreControl}
      >
        🎯 Control de Puntajes
      </button>

      {/* Reset Partida */}
      <button
        style={{
          marginTop: "15px",
          backgroundColor: "#aa0000",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
        onClick={() => {
          const confirmar = window.confirm(
            "¿Seguro que querés borrar la partida guardada?\nSe eliminará todo el progreso."
          );

          if (confirmar) {
            localStorage.removeItem("jeopardyPartida");
            window.location.reload();
          }
        }}
      >
        🗑 Reset Partida
      </button>

    </div>
  );
}