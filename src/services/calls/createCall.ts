import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase/firebase"

export const createCall = async (departmentId: number): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "calls"), {
      departmentId,
      status: "waiting",
      createdAt: serverTimestamp()
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creando llamada:", error);
    // propagate the error so callers can handle it
    throw error;
  }
}