import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const rejectCall = async (callId: string) => {

  const ref = doc(db, "calls", callId);

  await updateDoc(ref, {
    status: "rejected"
  });

};