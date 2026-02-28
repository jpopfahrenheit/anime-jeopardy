import { useEffect, useState } from "react";

const DEFAULT_EQUIPOS = [
  { nombre: "Equipo 1", puntos: 0 },
  { nombre: "Equipo 2", puntos: 0 },
  { nombre: "Equipo 3", puntos: 0 },
  { nombre: "Equipo 4", puntos: 0 }
];

export default function ScoreControl({ volverAlJuego }) {
  const [equipos, setEquipos] = useState(() => {
    const guardado = localStorage.getItem("jeopardyScore");
    return guardado ? JSON.parse(guardado) : DEFAULT_EQUIPOS;
  });
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [nombreTemp, setNombreTemp] = useState("");

  // 🔹 Cargar desde localStorage
  useEffect(() => {
    const guardado = localStorage.getItem("jeopardyScore");
    if (guardado) {
      setEquipos(JSON.parse(guardado));
    }
  }, []);

  // 🔹 Guardado automático
  useEffect(() => {
    localStorage.setItem("jeopardyScore", JSON.stringify(equipos));
  }, [equipos]);

  const sumar = (index) => {
    const nuevos = [...equipos];
    nuevos[index].puntos += 200;
    setEquipos(nuevos);
  };

  const restar = (index) => {
    const nuevos = [...equipos];
    nuevos[index].puntos = Math.max(0, nuevos[index].puntos - 200);
    setEquipos(nuevos);
  };

  const comenzarEdicion = (index) => {
    setEditandoIndex(index);
    setNombreTemp(equipos[index].nombre);
  };

  const confirmarNombre = (index) => {
    if (!nombreTemp.trim()) return;

    const nuevos = [...equipos];
    nuevos[index].nombre = nombreTemp.trim();
    setEquipos(nuevos);
    setEditandoIndex(null);
  };

  const resetPuntajes = () => {
    const confirmar = window.confirm(
      "¿Seguro que querés resetear los puntajes?"
    );

    if (!confirmar) return;

    const nuevos = equipos.map((eq) => ({
      ...eq,
      puntos: 0
    }));

    setEquipos(nuevos);
  };

  return (
    <div className="board-container">

      <h1 className="board-title">Control de Puntajes</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "25px",
          marginTop: "40px"
        }}
      >
        {equipos.map((equipo, index) => (
          <div
            key={index}
            style={{
              border: "3px solid #1e3fa3",
              borderRadius: "15px",
              padding: "25px",
              textAlign: "center"
            }}
          >

            {/* Nombre */}
            {editandoIndex === index ? (
              <input
                type="text"
                value={nombreTemp}
                autoFocus
                onChange={(e) => setNombreTemp(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    confirmarNombre(index);
                  }
                }}
                style={{
                  fontSize: "1.2rem",
                  padding: "5px",
                  marginBottom: "15px",
                  width: "100%"
                }}
              />
            ) : (
              <h2
                style={{
                  cursor: "pointer",
                  marginBottom: "15px"
                }}
                onClick={() => comenzarEdicion(index)}
              >
                {equipo.nombre}
              </h2>
            )}

            {/* Puntaje */}
            <div
              style={{
                fontSize: "4rem",
                color: "gold",
                fontWeight: "bold",
                marginBottom: "20px"
              }}
            >
              {equipo.puntos}
            </div>

            {/* Botones */}
            <button
              className="modal-button reveal"
              style={{ width: "45%" }}
              onClick={() => sumar(index)}
            >
              +200
            </button>

            <button
              className="modal-button close"
              style={{ width: "45%", marginLeft: "10%" }}
              onClick={() => restar(index)}
            >
              -200
            </button>

          </div>
        ))}
      </div>

      <div style={{ marginTop: "50px", textAlign: "center" }}>
        <button
          className="modal-button"
          style={{ backgroundColor: "#aa0000" }}
          onClick={resetPuntajes}
        >
          Reset Puntajes
        </button>

        <button
          className="modal-button close"
          style={{ marginLeft: "20px" }}
          onClick={volverAlJuego}
        >
          Volver al Juego
        </button>
      </div>

    </div>
  );
}