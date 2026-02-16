import { useState } from "react";
import "./QuestionModal.css";

export default function QuestionModal({ pregunta, onClose }) {
  const [mostrarRespuesta, setMostrarRespuesta] = useState(false);

  if (!pregunta) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">

        <div className="modal-value">
          {pregunta.valor}
        </div>

        <h2 className="modal-question">
          {pregunta.pregunta}
        </h2>

        {!mostrarRespuesta ? (
          <button
            className="modal-button reveal"
            onClick={() => setMostrarRespuesta(true)}
          >
            Mostrar Respuesta
          </button>
        ) : (
          <div className="modal-answer">
            {pregunta.respuesta}
          </div>
        )}

        <button className="modal-button close" onClick={() => {
          setMostrarRespuesta(false);
          onClose();
        }}>
          Cerrar
        </button>

      </div>
    </div>
  );
}
