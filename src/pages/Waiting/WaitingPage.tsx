import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { listenCall } from "../../services/calls/listenCall";

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

  // redirect when status changes
  useEffect(() => {
    if (call?.status === "accepted") {
      // include role so ChatPage knows who is sending messages
      navigate(`/chat/${callId}?role=portero`);
    } else if (call?.status === "rejected") {
      // optionally go back or show another page
      navigate(`/portero`);
    }
  }, [call, callId, navigate]);

  return (
    <div>

      <h1>Esperando respuesta...</h1>

      {call?.status === "waiting" && (
        <p>Llamando al departamento...</p>
      )}

      {call?.status === "accepted" && (
        <p>Conectado</p>
      )}

      {call?.status === "rejected" && (
        <p>No atendieron</p>
      )}

    </div>
  )
}