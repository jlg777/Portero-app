import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { listenMessages } from "../../services/chat/listenMessages";
import { sendMessage } from "../../services/chat/sendMessage";
import { finalizeCall } from "../../services/calls/finalizeCall";

export const ChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get("role");

  if (!id || !role) return <p>Error: falta información de rol o id</p>;

  const callId = id;

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [reason, setReason] = useState("");
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    if (!callId) return;

    const unsubscribe = listenMessages(callId, setMessages);

    return () => unsubscribe();
  }, [callId]);

  const handleSend = async () => {
    if (!text || !role) return;

    await sendMessage(callId, role, text);

    setText("");
  };

  return (
    <div>
      <h1>Chat</h1>

      <div>
        {messages.map((msg) => (
          <p key={msg.id}>
            <b>{msg.sender}:</b> {msg.text}
          </p>
        ))}
      </div>

      <input value={text} onChange={(e) => setText(e.target.value)} />

      <button onClick={handleSend} disabled={ended}>Enviar</button>

      <hr />

      {ended ? (
        <p>La llamada ha finalizado{reason && `: ${reason}`}</p>
      ) : (
        <div>
          <h3>Finalizar llamada</h3>
          <input
            placeholder="Motivo de la finalización"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <button
            onClick={async () => {
              if (!reason) return;
              await finalizeCall(callId, reason);
              setEnded(true);
              // navegar de regreso al portero o residente según el rol
              navigate(role === "portero" ? "/portero" : "/resident");
            }}
          >
            Finalizar
          </button>
        </div>
      )}
    </div>
  );
};
