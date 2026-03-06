import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const listenCall = (
  callId: string,
  callback: (data: any) => void
) => {

  const ref = doc(db, "calls", callId);

  return onSnapshot(ref, (snapshot) => {
    callback({
      id: snapshot.id,
      ...snapshot.data()
    });
  });

};