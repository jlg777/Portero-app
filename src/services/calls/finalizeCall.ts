import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const finalizeCall = async (callId: string, reason: string) => {
  const ref = doc(db, "calls", callId);

  await updateDoc(ref, {
    status: "finished",
    reason,
    finishedAt: new Date()
  });
};
