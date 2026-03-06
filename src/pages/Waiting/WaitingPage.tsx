import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "../../services/firebase/firebase"

export const WaitingPage = () => {

  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {

    if (!id) return

    const ref = doc(db, "calls", id)

    const unsubscribe = onSnapshot(ref, (snapshot) => {

      const data = snapshot.data()

      if (!data) return

      if (data.status === "accepted") {
        navigate(`/chat/${id}`)
      }

      if (data.status === "rejected") {
        alert("La llamada fue rechazada")
        navigate("/portero")
      }

    })

    return () => unsubscribe()

  }, [])

  return (
    <div>

      <h1>📞 Llamando...</h1>

      <p>Esperando que el residente atienda</p>

    </div>
  )
}