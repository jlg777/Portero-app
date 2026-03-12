import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { listenMessages } from "../../services/chat/listenMessages";
import { sendMessage } from "../../services/chat/sendMessage";
import "../../index.css";
import { finalizeCall } from "../../services/calls/finalizeCall";
import { listenCall } from "../../services/calls/listenCall";
import { setTyping } from "../../services/calls/setTyping";
import { MessageBubble } from "../../componets/MessageBubble";

export const ChatPage = () => {
  const [callStatus, setCallStatus] = useState("active");
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [callEndedReason, setCallEndedReason] = useState<string | null>(null);
  const [endingCall, setEndingCall] = useState(false);
  const navigate = useNavigate();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const callId = id!;
  type Role = "portero" | "resident";

  const role = (searchParams.get("role") || "resident") as Role;
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const finishedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        await finalizeCall(callId, "system");
      } catch (err) {
        console.error("Error finalizando por timeout", err);
      }
    }, 60000);
  };

  useEffect(() => {
    const unsubscribe = listenMessages(callId, setMessages);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [callId]);

  useEffect(() => {
    const unsubscribe = listenCall(callId, (call) => {
      if (!call) return;

      setCallStatus(call.status);

      if (call.status === "active") {
        resetTimeout(); // 👈 AQUÍ VA
      }

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
          navigate(
            role === "portero" ? "/portero" : `/resident/${call.departmentId}`,
          );
        }, 5000);
      }
    });

    return () => unsubscribe();
  }, [callId, navigate, role]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!text.trim() || sending) return;

    try {
      setSending(true);

      await sendMessage(callId, role, text);

      await setTyping(callId, role, false);
      resetTimeout();
      setText("");
      inputRef.current?.focus();
    } catch (error) {
      console.error("Error enviando mensaje:", error);

      alert("No se pudo enviar el mensaje. Intenta nuevamente.");
    } finally {
      setSending(false);
    }
  };

  const handleEndCall = async () => {
    if (endingCall) return;

    try {
      setEndingCall(true);
      await finalizeCall(callId, role);
    } catch (error) {
      console.error("Error finalizando llamada:", error);
      alert("No se pudo finalizar la llamada.");
      setEndingCall(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (callStatus === "active") {
      resetTimeout();
    }
  }, [callStatus]);

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
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} role={role} />
        ))}

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

            {callEndedReason === "system" &&
              "⏱️ La llamada terminó por inactividad"}

            {!callEndedReason && "📴 La llamada finalizó"}

            <div className="returning">Volviendo al panel...</div>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      <div className="chat-form">
        <input
          ref={inputRef}
          className="chat-input"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setTyping(callId, role, true);
            resetTimeout();
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
          disabled={callStatus === "finished" || sending}
        >
          ➤
        </button>
        <button
          className="end-call-button"
          onClick={handleEndCall}
          disabled={endingCall}
        >
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
