import { useEffect, useState } from "react";
import { listenCalls } from "../../services/calls/listenCalls";
import { updateCallStatus } from "../../services/calls/updateCallStatus";
import { useNavigate } from "react-router-dom";

export const ResidentPage = () => {

    const navigate = useNavigate()

  const departmentId = 3; // simulamos que el residente es del depto 3

  const [incomingCall, setIncomingCall] = useState<any>(null);

 const handleAccept = async () => {

  if (!incomingCall?.id) return

  await updateCallStatus(incomingCall.id, "accepted")

  navigate(`/chat/${incomingCall.id}`)
}

  const handleReject = async () => {
    if (!incomingCall) return;

    await updateCallStatus(incomingCall.id, "rejected");

    setIncomingCall(null);
  };

  useEffect(() => {
    const unsubscribe = listenCalls(departmentId, (call) => {
      setIncomingCall(call);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Panel Residente</h1>

      {incomingCall ? (
        <div>
          <h2>📞 Llamada entrante</h2>
          <p>Departamento: {incomingCall.departmentId}</p>

          <button onClick={handleAccept}>Atender</button>

          <button onClick={handleReject}>Rechazar</button>
        </div>
      ) : (
        <p>No hay llamadas</p>
      )}
    </div>
  );
};
