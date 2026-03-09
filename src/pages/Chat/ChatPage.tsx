import { useEffect, useRef, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { listenMessages } from "../../services/chat/listenMessages"
import { sendMessage } from "../../services/chat/sendMessage"
import '../../index.css'

export const ChatPage = () => {

  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()

  const callId = id!
  const role = searchParams.get("role") || "resident"

  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState("")

  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {

    const unsubscribe = listenMessages(callId, setMessages)

    return () => unsubscribe()

  }, [callId])


  // scroll automático
  useEffect(() => {

    bottomRef.current?.scrollIntoView({ behavior: "smooth" })

  }, [messages])


  const handleSend = async () => {

    if (!text.trim()) return

    await sendMessage(callId, role, text)

    setText("")

  }


  return (
    <div className="chat-container">

      <div className="chat-header">
        <h1>Chat Portero</h1>
        <p>Comunicación con el edificio</p>
      </div>


      <div className="messages-container">

        {messages.map((msg) => {

          const isMe = msg.sender === role

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

              <div className="message-content">
                {msg.text}
              </div>

              {isMe && (
                <div className="message-icon">
                  {role === "portero" ? "👮" : "👤"}
                </div>
              )}

            </div>

          )
        })}

        <div ref={bottomRef}></div>

      </div>


      <div className="chat-form">

        <input
          className="chat-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje..."
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend()
          }}
        />

        <button
          className="send-button"
          onClick={handleSend}
        >
          ➤
        </button>

      </div>

    </div>
  )
}