import { BrowserRouter, Routes, Route } from "react-router-dom"
import { PorteroPage } from "../pages/PorteroPage"
import { ResidentPage } from "../pages/Resident/ResidentPage"
import { ChatPage } from "../pages/Chat/ChatPage"
import { WaitingPage } from "../pages/Waiting/WaitingPage"

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/portero" element={<PorteroPage />} />
        <Route path="/resident" element={<ResidentPage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="/waiting/:id" element={<WaitingPage />} />
      </Routes>
    </BrowserRouter>
  )
}