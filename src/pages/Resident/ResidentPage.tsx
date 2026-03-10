import { useEffect, useState } from "react";
import { listenCalls } from "../../services/calls/listenCalls";
import { updateCallStatus } from "../../services/calls/updateCallStatus";
import { useNavigate } from "react-router-dom";
import "../../index.css";

export const ResidentPage = () => {
  const navigate = useNavigate();
  const departmentId = 3;

  const [incomingCall, setIncomingCall] = useState<any>(null);
  const [callEndedMessage, setCallEndedMessage] = useState("");

  const handleAccept = async () => {
    if (!incomingCall?.id) return;

    await updateCallStatus(incomingCall.id, "accepted");

    navigate(`/chat/${incomingCall.id}?role=resident`);
  };

  const handleReject = async () => {
    if (!incomingCall) return;

    await updateCallStatus(incomingCall.id, "rejected");

    setIncomingCall(null);
  };

 useEffect(() => {
  const unsubscribe = listenCalls(departmentId, (call) => {

    if (!call) {
      setIncomingCall(null);
      return;
    }

    if (call.status === "cancelled") {
      setCallEndedMessage("❌ El portero canceló la llamada");
      setIncomingCall(null);

      setTimeout(() => {
        setCallEndedMessage("");
      }, 3000);

      return;
    }

    if (call.status === "finished") {
      setCallEndedMessage("📴 La llamada finalizó");
      setIncomingCall(null);

      setTimeout(() => {
        setCallEndedMessage("");
      }, 3000);

      return;
    }

    if (call.status === "rejected") {
      setCallEndedMessage("❌ Llamada rechazada");
      setIncomingCall(null);

      setTimeout(() => {
        setCallEndedMessage("");
      }, 3000);

      return;
    }

    setIncomingCall(call);

  });

  return () => unsubscribe();
}, []);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Panel Residente</h1>
        <p>Comunicación con portería</p>
      </div>

      <div className="messages-container">
        {incomingCall ? (
          <div className="incoming-call">
            <h2>📞 Llamada entrante...</h2>
            <p>Portería está llamando</p>
            <div className="typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="call-actions">
              <button className="accept-call-button" onClick={handleAccept}>
                Atender
              </button>

              <button className="reject-call-button" onClick={handleReject}>
                Rechazar
              </button>
            </div>
          </div>
        ) : callEndedMessage ? (
          <p className="call-cancelled">{callEndedMessage}</p>
        ) : (
          <div className="welcome-message">
            <h2>Sin llamadas</h2>
            <p>Cuando portería te llame aparecerá aquí</p>
          </div>
        )}
      </div>
    </div>
  );
};
