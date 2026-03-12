import { useEffect, useRef, useState } from "react";
import { listenCalls } from "../../services/calls/listenCalls";
import { updateCallStatus } from "../../services/calls/updateCallStatus";
import { useNavigate, useParams } from "react-router-dom";
import "../../index.css";
import { finalizeCall } from "../../services/calls/finalizeCall";
import { registerDevice } from "../../services/device/registerDevice";

export const ResidentPage = () => {
  const navigate = useNavigate();
  const { departmentIdNumber } = useParams();
  const departmentId = Number(departmentIdNumber);

  const [incomingCall, setIncomingCall] = useState<any>(null);
  const [callEndedMessage, setCallEndedMessage] = useState("");

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAccept = async () => {
    if (!incomingCall?.id) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    await updateCallStatus(incomingCall.id, "accepted");

    navigate(`/chat/${incomingCall.id}?role=resident`);
  };

  const handleReject = async () => {
    if (!incomingCall) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    await finalizeCall(incomingCall.id, "resident");
    setIncomingCall(null);
  };

  useEffect(() => {
    if (!departmentId) return;

    let deviceId = localStorage.getItem("deviceId");

    if (!deviceId) {
      deviceId = crypto.randomUUID();

      localStorage.setItem("deviceId", deviceId);

      registerDevice(deviceId, departmentId);
    }
  }, [departmentId]);

  useEffect(() => {
    const unsubscribe = listenCalls(departmentId, (call) => {
      if (!call) {
        setIncomingCall(null);
        return;
      }
      if (call.status === "waiting") {
        setIncomingCall(call);
        return;
      }

      if (call.status === "finished") {
        if (call.reason === "portero") {
          setCallEndedMessage("❌ El portero canceló la llamada");
        }

        if (call.reason === "resident") {
          setCallEndedMessage("❌ Cancelaste la llamada");
        }

        if (call.reason === "canceled") {
          setCallEndedMessage("📞 Llamada perdida");
        }

        setIncomingCall(null);

        setTimeout(() => setCallEndedMessage(""), 3000);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!incomingCall) return;

    timeoutRef.current = setTimeout(async () => {
      try {
        await finalizeCall(incomingCall.id, "canceled");
        setIncomingCall(null);
      } catch (error) {
        console.error("Error cancelando llamada", error);
      }
    }, 30000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [incomingCall]);

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
          <div className="messages-container waiting-container">
            <div className="waiting-message error">
              <h2>{callEndedMessage}</h2>
            </div>
          </div>
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
