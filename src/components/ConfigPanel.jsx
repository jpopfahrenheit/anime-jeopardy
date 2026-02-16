import { useEffect, useState } from "react";

export default function ConfigPanel({ onStart }) {
  const [nombreJuego, setNombreJuego] = useState("Jeopardy Anime");
  const [sets, setSets] = useState([]);
  const [setSeleccionado, setSetSeleccionado] = useState("");
  const [cantidadEquipos, setCantidadEquipos] = useState(2);
  const [logoSeleccionado, setLogoSeleccionado] = useState("");
  const [timerDuracion, setTimerDuracion] = useState(15);


  // Cargar sets.json al iniciar
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
      cantidadEquipos,
      logoSeleccionado,
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

      {/* Logo */}
      <div style={{ marginBottom: "20px" }}>
        <label>Logo (opcional):</label><br />
        <input
          type="text"
          placeholder="Ej: jornadas.png"
          value={logoSeleccionado}
          onChange={(e) => setLogoSeleccionado(e.target.value.trim())}
          style={{ padding: "8px", width: "250px", marginTop: "5px" }}
        />

        {logoSeleccionado && (
          <div style={{ marginTop: "10px" }}>
            <img
              src={`/logo/${logoSeleccionado}`}
              alt="Preview Logo"
              style={{
                maxHeight: "80px",
                objectFit: "contain",
                border: "1px solid #444",
                padding: "5px"
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        <div style={{ fontSize: "0.8rem", marginTop: "5px" }}>
          Archivo debe estar en /public/logo/
        </div>
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

      {/* Cantidad de Equipos */}
      <div style={{ marginBottom: "20px" }}>
        <label>Cantidad de equipos:</label><br />
        {[2, 3, 4].map((num) => (
          <label key={num} style={{ marginRight: "15px" }}>
            <input
              type="radio"
              value={num}
              checked={cantidadEquipos === num}
              onChange={() => setCantidadEquipos(num)}
            />
            {num}
          </label>
        ))}
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

    </div>
  );
}
