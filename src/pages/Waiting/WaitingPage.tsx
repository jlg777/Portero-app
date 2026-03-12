import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { listenCall } from "../../services/calls/listenCall";
import "../../index.css";
import { finalizeCall } from "../../services/calls/finalizeCall";

export const WaitingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  if (!id) return <p>Error de llamada</p>;

  const callId = id;
  const [call, setCall] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = listenCall(callId, setCall);
    return () => unsubscribe();
  }, [callId]);

  useEffect(() => {
    if (call?.status === "accepted") {
      navigate(`/chat/${callId}?role=portero`);
    }

    if (call?.status === "rejected") {
      setTimeout(() => {
        navigate("/portero");
      }, 5000);
    }

    if (call?.status === "finished") {
      setTimeout(() => {
        navigate("/portero");
      }, 4000);
    }
  }, [call, callId, navigate]);

  const handleEndCall = async () => {
    await finalizeCall(callId, "canceled");
    navigate("/portero");
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Portero Virtual</h1>
        <p>Conectando con el departamento</p>
      </div>

      <div className="messages-container waiting-container">
        {call?.status === "accepted" && (
          <div className="waiting-message success">
            <h2>✅ Conectando...</h2>
          </div>
        )}

        {call?.status === "waiting" && (
          <div className="waiting-message">
            <h2>📞 Llamando al departamento...</h2>

            <div className="typing">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <p>Esperando que el residente atienda</p>

            <button
              className="end-call-button cancel-call-button"
              onClick={handleEndCall}
            >
              Cancelar llamada
            </button>
          </div>
        )}

        {call?.status === "finished" && call?.reason === "canceled" && (
          <div className="waiting-message error">
            <h2>⏱ El residente no respondió</h2>
            <p>La llamada se canceló automáticamente</p>
          </div>
        )}
      </div>
    </div>
  );
};
