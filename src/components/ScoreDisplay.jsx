import { useEffect, useState } from "react";
import "./Board.css";

const DEFAULT_EQUIPOS = [
  { nombre: "Equipo 1", puntos: 0 },
  { nombre: "Equipo 2", puntos: 0 },
  { nombre: "Equipo 3", puntos: 0 },
  { nombre: "Equipo 4", puntos: 0 }
];

export default function ScoreDisplay({ volverAlJuego }) {
  const [equipos, setEquipos] = useState(DEFAULT_EQUIPOS);

  // 🔹 Cargar datos iniciales
  useEffect(() => {
    const guardado = localStorage.getItem("jeopardyScore");
    if (guardado) {
      setEquipos(JSON.parse(guardado));
    }
  }, []);

  // 🔹 Escuchar cambios entre ventanas
  useEffect(() => {
    const handleStorage = () => {
      const guardado = localStorage.getItem("jeopardyScore");
      if (guardado) {
        setEquipos(JSON.parse(guardado));
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div className="board-container">

      <h1 className="board-title">Puntajes</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          marginTop: "40px"
        }}
      >
        {equipos.map((equipo, index) => (
          <div
            key={index}
            style={{
              border: "3px solid #1e3fa3",
              borderRadius: "20px",
              padding: "40px",
              textAlign: "center"
            }}
          >
            <h2 style={{ fontSize: "2rem", marginBottom: "20px" }}>
              {equipo.nombre}
            </h2>

            <div
              style={{
                fontSize: "5rem",
                color: "gold",
                fontWeight: "bold"
              }}
            >
              {equipo.puntos}
            </div>
          </div>
        ))}
      </div>

      <button
        className="modal-button close"
        style={{ marginTop: "40px" }}
        onClick={volverAlJuego}
      >
        Volver al Juego
      </button>

    </div>
  );
}