import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { listenMessages } from "../../services/chat/listenMessages";
import { sendMessage } from "../../services/chat/sendMessage";

export const ChatPage = () => {
  const { id } = useParams();

  const callId = id as string;

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!callId) return;

    const unsubscribe = listenMessages(callId, setMessages);

    return () => unsubscribe();
  }, [callId]);

  const handleSend = async () => {
    if (!text) return;

    await sendMessage(callId, "resident", text);

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

      <button onClick={handleSend}>Enviar</button>
    </div>
  );
};
