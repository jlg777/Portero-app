import { doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase/firebase"

export const updateCallStatus = async (
  callId: string,
  status: "accepted" | "rejected"
) => {

  const ref = doc(db, "calls", callId)

  await updateDoc(ref, {
    status
  })

}