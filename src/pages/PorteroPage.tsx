import { useNavigate } from "react-router-dom";
import { createCall } from "../services/calls/createCall";
import { useState } from "react";
import { listenCall } from "../services/calls/listenCall";

export const PorteroPage = () => {

  const navigate = useNavigate()

  const [call, setCall] = useState<any>(null)

  const handleCall = async (dept:number) => {

    const callId = await createCall(dept)

    listenCall(callId, setCall)

    navigate(`/waiting/${callId}`)

  }

  return (
    <div>

      <h1>Portero del Edificio</h1>

      <button onClick={()=>handleCall(1)}>Depto 1</button>
      <button onClick={()=>handleCall(2)}>Depto 2</button>
      <button onClick={()=>handleCall(3)}>Depto 3</button>
      <button onClick={()=>handleCall(4)}>Depto 4</button>
      <button onClick={()=>handleCall(5)}>Depto 5</button>
      <button onClick={()=>handleCall(6)}>Depto 6</button>



    </div>
  )
}