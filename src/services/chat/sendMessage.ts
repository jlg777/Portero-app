import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase/firebase"

export const sendMessage = async (
  callId: string,
  sender: string,
  text: string
) => {

  await addDoc(collection(db, "messages"), {
    callId,
    sender,
    text,
    createdAt: serverTimestamp()
  })

}