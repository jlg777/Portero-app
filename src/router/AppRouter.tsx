import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { PorteroPage } from "../pages/PorteroPage"
import { ResidentPage } from "../pages/Resident/ResidentPage"
import { ResidentSelectPage } from "../pages/Resident/ResidentSelectPage"
import { ChatPage } from "../pages/Chat/ChatPage"
import { WaitingPage } from "../pages/Waiting/WaitingPage"

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/resident" replace />} />
        <Route path="/resident" element={<ResidentSelectPage />} />
        <Route path="/resident/:departmentIdNumber" element={<ResidentPage />} />
        <Route path="/portero" element={<PorteroPage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="/waiting/:id" element={<WaitingPage />} />
      </Routes>
    </BrowserRouter>
  )
}