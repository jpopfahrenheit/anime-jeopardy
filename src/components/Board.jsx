import QuestionModal from "./QuestionModal";
import { useEffect, useState } from "react";
import "./Board.css";

export default function Board({ volver, config, progresoInicial, irAPuntajes }) {

  const [preguntaActiva, setPreguntaActiva] = useState(null);
  const [data, setData] = useState(null);
  const [progreso, setProgreso] = useState(progresoInicial || {});

  // 🔹 Atajos teclado
  useEffect(() => {
    const handleKeyDown = (e) => {

      // Volver al config
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "b") {
        e.preventDefault();
        volver();
      }

      // Ir a pantalla de puntajes
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (irAPuntajes) {
          irAPuntajes();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [volver, irAPuntajes]);

  // 🔹 Cargar preguntas
  useEffect(() => {
    if (!config?.archivoPreguntas) return;

    fetch(`/preguntas/${config.archivoPreguntas}.json`)
      .then((res) => res.json())
      .then((json) => setData(json));
  }, [config]);

  // 🔹 Guardado automático
  useEffect(() => {
    if (!config) return;

    const dataGuardar = {
      config,
      progreso
    };

    localStorage.setItem("jeopardyPartida", JSON.stringify(dataGuardar));
  }, [progreso, config]);

  if (!data) return <h2 style={{ color: "white" }}>Cargando...</h2>;

  const categorias = data.categorias;
  const cantidadFilas = Math.max(
    ...categorias.map((cat) => cat.preguntas.length)
  );

  return (
    <div className="board-container">

      {/* HEADER SIN LOGO */}
      <div className="board-header" style={{ position: "relative" }}>
        
        <h1 className="board-title">
          {config?.nombreJuego || "Jeopardy Anime"}
        </h1>

        <button
          className="modal-button"
          style={{
            position: "absolute",
            right: "20px",
            top: "20px",
            padding: "8px 15px",
            fontSize: "0.9rem"
          }}
          onClick={irAPuntajes}
        >
          🏆 Puntajes
        </button>

      </div>

      {/* TABLERO */}
      <div
        className="board-grid"
        style={{
          gridTemplateColumns: `repeat(${categorias.length}, 1fr)`
        }}
      >
        {/* CATEGORÍAS */}
        {categorias.map((cat) => (
          <div key={cat.nombre} className="category">
            {cat.nombre}
          </div>
        ))}

        {/* PREGUNTAS */}
        {Array.from({ length: cantidadFilas }).map((_, fila) =>
          categorias.map((cat, colIndex) => {
            const pregunta = cat.preguntas[fila];

            const ultimoJugado = progreso[colIndex] ?? -1;
            const estaHabilitada = fila === ultimoJugado + 1;
            const yaUsada = fila <= ultimoJugado;

            return (
              <div
                key={`${colIndex}-${fila}`}
                className={`cell 
                  ${yaUsada ? "used" : ""} 
                  ${!estaHabilitada && !yaUsada ? "locked" : ""}`}
                onClick={() => {
                  if (estaHabilitada) {
                    setPreguntaActiva(pregunta);
                    setProgreso({
                      ...progreso,
                      [colIndex]: fila
                    });
                  }
                }}
              >
                {yaUsada ? "" : pregunta?.valor}
              </div>
            );
          })
        )}
      </div>

      <QuestionModal
        pregunta={preguntaActiva}
        duracion={config?.timerDuracion}
        onClose={() => setPreguntaActiva(null)}
      />

    </div>
  );
}