import QuestionModal from "./QuestionModal";
import { useEffect, useState } from "react";
import "./Board.css";

export default function Board({ volver, config }) {

  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [preguntaActiva, setPreguntaActiva] = useState(null);
  const [data, setData] = useState(null);
  const [progreso, setProgreso] = useState({});

  // 🔹 Atajo secreto: Ctrl + Shift + B
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "b") {
        setMostrarConfirmacion(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 🔹 Cargar preguntas
  useEffect(() => {
    fetch(`/preguntas/${config.archivoPreguntas}.json`)
      .then((res) => res.json())
      .then((json) => setData(json));
  }, [config]);

  if (!data) return <h2 style={{ color: "white" }}>Cargando...</h2>;

  const categorias = data.categorias;
  const cantidadFilas = Math.max(
    ...categorias.map((cat) => cat.preguntas.length)
  );

  return (
    <div className="board-container">

      <div className="board-header">
        <div className="header-spacer"></div>

        <h1 className="board-title">
          {config?.nombreJuego || "Jeopardy Anime"}
        </h1>

        <div className="header-logo">
          {config?.logoSeleccionado && (
            <img
              src={`/logo/${config.logoSeleccionado}`}
              alt="Logo"
              className="board-logo"
            />
          )}
        </div>
      </div>

      <div
        className="board-grid"
        style={{
          gridTemplateColumns: `repeat(${categorias.length}, 1fr)`
        }}
      >
        {/* FILA DE CATEGORÍAS */}
        {categorias.map((cat) => (
          <div key={cat.nombre} className="category">
            {cat.nombre}
          </div>
        ))}

        {/* FILAS DE PREGUNTAS */}
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
        onClose={() => setPreguntaActiva(null)}
      />

      {/* 🔹 Popup Confirmación Volver */}
      {mostrarConfirmacion && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ marginBottom: "30px" }}>
              ¿Seguro que querés volver?
            </h2>

            <button
              className="modal-button close"
              onClick={() => setMostrarConfirmacion(false)}
            >
              Cancelar
            </button>

            <button
              className="modal-button reveal"
              onClick={() => volver()}
            >
              Confirmar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
