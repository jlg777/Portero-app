import { BrowserRouter, Routes, Route } from "react-router-dom"
import { PorteroPage } from "../pages/PorteroPage"

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/portero" element={<PorteroPage />} />
      </Routes>
    </BrowserRouter>
  )
}