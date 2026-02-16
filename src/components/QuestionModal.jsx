import { useEffect, useRef, useState } from "react";
import "./QuestionModal.css";

export default function QuestionModal({ pregunta, onClose, duracion = 15 }) {

  const [mostrarRespuesta, setMostrarRespuesta] = useState(false);
  const [tiempo, setTiempo] = useState(duracion);
  const [pausado, setPausado] = useState(false);

  const audioRef = useRef(null);
  const yaSonido = useRef(false);

  // 🔹 Reset cuando cambia pregunta
  useEffect(() => {
    if (pregunta) {
      setMostrarRespuesta(false);
      setTiempo(duracion);
      setPausado(false);
      yaSonido.current = false;

      audioRef.current = new Audio("/beep.mp3");
    }
  }, [pregunta, duracion]);

  // 🔹 Countdown
  useEffect(() => {
    if (!pregunta) return;
    if (pausado) return;
    if (tiempo <= 0) return;

    const intervalo = setInterval(() => {
      setTiempo((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [tiempo, pausado, pregunta]);

  // 🔹 Sonido al llegar a 0
  useEffect(() => {
    if (tiempo === 0 && !yaSonido.current) {
      yaSonido.current = true;
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [tiempo]);

  if (!pregunta) return null;

  const resetTimer = () => {
    setTiempo(duracion);
    setPausado(false);
    yaSonido.current = false;
  };

  const mostrarResp = () => {
    setMostrarRespuesta(true);
    setPausado(true);
  };

  const claseTimer =
    tiempo === 0
      ? "modal-timer finish"
      : tiempo <= 5
      ? "modal-timer warning"
      : "modal-timer";

  return (
    <div className="modal-overlay">
      <div className="modal-content">

        <div className="modal-value">
          {pregunta.valor}
        </div>

        <h2 className="modal-question">
          {pregunta.pregunta}
        </h2>

        {/* TIMER */}
        <div className={claseTimer}>
          ⏳ {tiempo}
        </div>

        {!mostrarRespuesta ? (
          <>
            <button
              className="modal-button reveal"
              onClick={mostrarResp}
            >
              Mostrar Respuesta
            </button>

            <button
              className="modal-button"
              onClick={resetTimer}
            >
              Reset Timer
            </button>
          </>
        ) : (
          <div className="modal-answer">
            {pregunta.respuesta}
          </div>
        )}

        <button
          className="modal-button close"
          onClick={() => {
            setMostrarRespuesta(false);
            onClose();
          }}
        >
          Cerrar
        </button>

      </div>
    </div>
  );
}
