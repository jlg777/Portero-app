import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const setTyping = async (
  callId: string,
  role: string,
  typing: boolean
) => {

  const field = role === "portero"
    ? "porteroTyping"
    : "residentTyping";

  await updateDoc(
    doc(db, "calls", callId),
    {
      [field]: typing
    }
  );

};