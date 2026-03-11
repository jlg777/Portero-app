import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

type CallEndReason = "portero" | "resident" | "canceled" | "system";

export const finalizeCall = async (
  callId: string,
  reason?: CallEndReason
) => {

  const ref = doc(db, "calls", callId);

  const updateData: any = {
    status: "finished",
    finishedAt: new Date()
  };

  if (reason) {
    updateData.reason = reason;
  }

  await updateDoc(ref, updateData);

};