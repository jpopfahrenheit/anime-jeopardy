import QuestionModal from "./QuestionModal";
import { useEffect, useState } from "react";
import "./Board.css";

export default function Board({ volver, config, progresoInicial }) {

  const [preguntaActiva, setPreguntaActiva] = useState(null);
  const [data, setData] = useState(null);
  const [progreso, setProgreso] = useState(progresoInicial || {});

  // 🔹 Atajo secreto: Ctrl + Shift + B
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "b") {
        volver(); // vuelve directo, sin confirmación
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
        {categorias.map((cat) => (
          <div key={cat.nombre} className="category">
            {cat.nombre}
          </div>
        ))}

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
        duracion={config.timerDuracion}
        onClose={() => setPreguntaActiva(null)}
      />

    </div>
  );
}
