import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase/firebase"

export const createCall = async (departmentId: number) => {
  try {
    const docRef = await addDoc(collection(db, "calls"), {
    departmentId,
    status: "pending",
    createdAt: serverTimestamp()
  })

  return docRef.id
}
   catch (error) {
    console.error("Error creando llamada:", error)
  }
}