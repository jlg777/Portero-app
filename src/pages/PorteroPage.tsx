import { useNavigate } from "react-router-dom";
import { createCall } from "../services/calls/createCall";
import { sendPushToResident } from "../services/messaging/sendPushNotification";
import { useState } from "react";
import "../index.css";

export const PorteroPage = () => {
  const navigate = useNavigate();
  const [loadingDept, setLoadingDept] = useState<number | null>(null);

  const handleCall = async (dept: number) => {
    setLoadingDept(dept);

    const callId = await createCall(dept);

    try {
      const result = await sendPushToResident(callId, dept);
      if (result.sent === 0) {
        console.info("Push: ningún dispositivo suscrito para depto", dept);
      }
    } catch (err) {
      console.error("Push no enviado:", err);
      // No bloquea la llamada - el residente puede ver en la app
    }

    navigate(`/waiting/${callId}`);
  };

  return (
    <div className="chat-container">

      <div className="chat-header">
        <h1>Portero del Edificio</h1>
        <p>Selecciona un departamento para llamar</p>
      </div>

      <div className="messages-container portero-container">

        <div className="departments-grid">

          {[1,2,3,4,5,6].map((dept)=>(
            <button
              key={dept}
              className="department-button"
              onClick={()=>handleCall(dept)}
              disabled={loadingDept !== null}
            >
              <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="green"
            viewBox="0 0 24 24"
          >
            <path d="M6.6 10.8a15.05 15.05 0 006.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.2 1.3.5 2.7.8 4.2.8.7 0 1.2.5 1.2 1.2V21c0 .7-.5 1.2-1.2 1.2C10.1 22.2 1.8 13.9 1.8 3.8 1.8 3.1 2.3 2.6 3 2.6h3.4c.7 0 1.2.5 1.2 1.2 0 1.5.3 2.9.8 4.2.1.4 0 .9-.2 1.2l-2.2 2.2z" />
          </svg> Depto {dept}
            </button>
          ))}

        </div>

      </div>

    </div>
  );
};