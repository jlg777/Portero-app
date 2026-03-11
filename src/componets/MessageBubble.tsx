import React from "react";
import "../index.css"

type Message = {
  id: string;
  sender: "portero" | "resident";
  text: string;
};

type Props = {
  msg: Message;
  role: "portero" | "resident";
};

export const MessageBubble = React.memo(({ msg, role }: Props) => {
  const isMe = msg.sender === role;

  return (
    <div className={`message ${isMe ? "resident" : "portero"}`}>
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
});