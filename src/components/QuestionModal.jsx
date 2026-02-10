export default function QuestionModal({ pregunta, onClose }) {
  if (!pregunta) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          textAlign: "center",
          maxWidth: "600px",
        }}
      >
        <h2>{pregunta.pregunta}</h2>

        <button
          onClick={() => alert("Respuesta: " + pregunta.respuesta)}
          style={{ margin: "10px" }}
        >
          Mostrar Respuesta
        </button>

        <br />
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
