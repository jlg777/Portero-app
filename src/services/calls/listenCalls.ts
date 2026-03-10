import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "../firebase/firebase"

export const listenCalls = (
  departmentId: number,
  callback: (call: any) => void
) => {

  const q = query(
    collection(db, "calls"),
    where("departmentId", "==", departmentId),
    where("status", "==", "waiting")
  )

  return onSnapshot(q, (snapshot) => {

    if (snapshot.empty) {
      callback(null)   // 🔥 limpiar llamada
      return
    }

    snapshot.forEach((doc) => {
      callback({ id: doc.id, ...doc.data() })
    })

  })
}