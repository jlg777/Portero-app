import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore"
import { db } from "../firebase/firebase"

export const listenMessages = (
  callId: string,
  callback: (messages: any[]) => void
) => {

  const q = query(
    collection(db, "messages"),
    where("callId", "==", callId),
    orderBy("createdAt")
  )

  return onSnapshot(q, (snapshot) => {

    const messages: any[] = []

    snapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      })
    })

    callback(messages)

  })
}