import { doc, setDoc } from "firebase/firestore"
import { db } from "../firebase/firebase"

export const registerDevice = async (
  deviceId: string,
  departmentId: number
) => {

  const ref = doc(db, "departments", deviceId)

  await setDoc(ref, {
    departmentId,
    active: true,
    createdAt: new Date()
  })

}