import QuestionModal from "./QuestionModal";
import { useEffect, useState } from "react";

export default function Board({ volver }) {
  const [preguntaActiva, setPreguntaActiva] = useState(null);
  const [data, setData] = useState(null);
  const [puntos, setPuntos] = useState(0);

  useEffect(() => {
    fetch("/preguntas/demo/preguntas.json")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  if (!data) return <h2>Cargando...</h2>;

  const categorias = data.categorias;
  const cantidadFilas = Math.max(...categorias.map(cat => cat.preguntas.length));

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Jeopardy Anime 🎌</h1>

      <table style={{ margin: "auto", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {categorias.map((cat) => (
              <th
                key={cat.nombre}
                style={{ border: "2px solid black", padding: "10px" }}
              >
                {cat.nombre}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: cantidadFilas }).map((_, fila) => (
            <tr key={fila}>
              {categorias.map((cat) => {
                const pregunta = cat.preguntas[fila];

                return (
                  <td
                    key={cat.nombre + fila}
                    style={{
                      border: "2px solid black",
                      padding: "20px",
                      cursor: "pointer",
                    }}
                    onClick={() => setPreguntaActiva(pregunta)}
                  >
                    {pregunta.valor}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <button onClick={volver}>Volver</button>

      {/* MODAL */}
      <QuestionModal
        pregunta={preguntaActiva}
        onClose={() => setPreguntaActiva(null)}
      />
    </div>
  );
}
