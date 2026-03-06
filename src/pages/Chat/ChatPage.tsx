import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { listenMessages } from "../../services/chat/listenMessages";
import { sendMessage } from "../../services/chat/sendMessage";
import { finalizeCall } from "../../services/calls/finalizeCall";
import { listenCall } from "../../services/calls/listenCall";

export const ChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get("role");

  if (!id || !role) return <p>Error: falta información de rol o id</p>;

  const callId = id;

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    if (!callId) return;

    const unsubscribe = listenMessages(callId, setMessages);

    return () => unsubscribe();
  }, [callId]);

  // observe call status so both sides are kicked out when someone finalizes
  useEffect(() => {
    if (!callId) return;
    const unsubscribe = listenCall(callId, (data: any) => {
      if (data.status === "finished") {
        setEnded(true);
        navigate(role === "portero" ? "/portero" : "/resident");
      }
    });
    return () => unsubscribe();
  }, [callId, role, navigate]);

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
        <p>La llamada ha finalizado.</p>
      ) : (
        <button
          onClick={async () => {
            await finalizeCall(callId);
            setEnded(true);
            navigate(role === "portero" ? "/portero" : "/resident");
          }}
        >
          Finalizar llamada
        </button>
      )}
    </div>
  );
};
