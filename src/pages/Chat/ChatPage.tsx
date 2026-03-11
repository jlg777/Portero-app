import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { listenMessages } from "../../services/chat/listenMessages";
import { sendMessage } from "../../services/chat/sendMessage";
import "../../index.css";
import { finalizeCall } from "../../services/calls/finalizeCall";
import { listenCall } from "../../services/calls/listenCall";
import { setTyping } from "../../services/calls/setTyping";

export const ChatPage = () => {
  const [callStatus, setCallStatus] = useState("active");
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [callEndedReason, setCallEndedReason] = useState<string | null>(null);

  const navigate = useNavigate();

  const callId = id!;
  type Role = "portero" | "resident";

  const role = (searchParams.get("role") || "resident") as Role;
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsubscribe = listenMessages(callId, setMessages);

    return () => unsubscribe();
  }, [callId]);

  const finishedRef = useRef(false);

  useEffect(() => {
    const unsubscribe = listenCall(callId, (call) => {
      if (!call) return;

      setCallStatus(call.status);

      if (role === "resident" && call.porteroTyping) {
        setTypingUser("portero");
      } else if (role === "portero" && call.residentTyping) {
        setTypingUser("resident");
      } else {
        setTypingUser(null);
      }

      if (call.status === "finished") {
        setCallEndedReason(call.reason);
      }

      if (call.status === "finished" && !finishedRef.current) {
        finishedRef.current = true;

        setTimeout(() => {
          navigate(role === "portero" ? "/portero" : "/resident");
        }, 5000);
      }
    });

    return () => unsubscribe();
  }, [callId, navigate, role]);

  // scroll automático
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || sending) return;

    setSending(true);

    await sendMessage(callId, role, text);
    await setTyping(callId, role, false);

    setText("");

    setSending(false);
  };

  const handleEndCall = async () => {
    await finalizeCall(callId, role);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Chat Portero</h1>
        <p>Comunicación con el edificio</p>
        {callStatus === "finished" && (
          <div className="call-ended">La llamada ha finalizado</div>
        )}
      </div>

      <div className="messages-container">
        {messages.map((msg) => {
          const isMe = msg.sender === role;

          return (
            <div
              key={msg.id}
              className={`message ${isMe ? "resident" : "portero"}`}
            >
              {!isMe && (
                <div className="message-icon">
                  {msg.sender === "portero" ? "👮" : "👤"}
                </div>
              )}

              <div className="message-content">{msg.text}</div>

              {isMe && (
                <div className="message-icon">
                  {role === "portero" ? "👮" : "👤"}
                </div>
              )}
            </div>
          );
        })}
        {typingUser && (
          <div className="typing-indicator">
            {typingUser === "portero"
              ? "👮 Portero está escribiendo..."
              : "👤 Residente está escribiendo..."}
          </div>
        )}
        {callStatus === "finished" && (
          <div className="call-ended">
            {callEndedReason === "portero" &&
              "📴 El portero finalizó la llamada"}
            {callEndedReason === "resident" &&
              "📴 El residente finalizó la llamada"}
            {!callEndedReason && "📴 La llamada finalizó"}

            <div className="returning">Volviendo al panel...</div>
          </div>
        )}
        
        <div ref={bottomRef}></div>
      </div>

      <div className="chat-form">
        <input
          className="chat-input"
          value={text}
          onChange={(e) => {
            setText(e.target.value);

            setTyping(callId, role, true);
          }}
          onBlur={() => {
            setTyping(callId, role, false);
          }}
          placeholder="Escribe un mensaje..."
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          disabled={callStatus === "finished"}
        />

        <button
          className="send-button"
          onClick={handleSend}
          disabled={callStatus === "finished"}
        >
          ➤
        </button>
        <button className="end-call-button" onClick={handleEndCall}>
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="white"
            viewBox="0 0 24 24"
          >
            <path d="M6.6 10.8a15.05 15.05 0 006.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.2 1.3.5 2.7.8 4.2.8.7 0 1.2.5 1.2 1.2V21c0 .7-.5 1.2-1.2 1.2C10.1 22.2 1.8 13.9 1.8 3.8 1.8 3.1 2.3 2.6 3 2.6h3.4c.7 0 1.2.5 1.2 1.2 0 1.5.3 2.9.8 4.2.1.4 0 .9-.2 1.2l-2.2 2.2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
