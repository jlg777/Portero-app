import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const finalizeCall = async (
  callId: string,
  status: "finished" | "cancelled",
  reason?: string
) => {
  const ref = doc(db, "calls", callId);

  const updateData: any = {
    status,
    finishedAt: new Date()
  };

  if (reason) {
    updateData.reason = reason;
  }

  await updateDoc(ref, updateData);
};