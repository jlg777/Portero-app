import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const registerDevice = async (
  deviceId: string,
  departmentId: number,
  pushSubscription?: PushSubscription | null
) => {
  const ref = doc(db, "departments", deviceId);

  const data: Record<string, unknown> = {
    departmentId,
    active: true,
    updatedAt: new Date(),
  };

  if (pushSubscription) {
    data.pushSubscription = pushSubscription.toJSON();
  }

  await setDoc(ref, data, { merge: true });
};