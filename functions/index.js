import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

initializeApp();

const db = getFirestore();

/**
 * Cuando se crea una llamada con status "waiting", envía push
 * a los residentes del departamento que tengan FCM token.
 */
export const onCallCreated = onDocumentCreated(
  { document: "calls/{callId}" },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const call = snapshot.data();
    const callId = event.params.callId;

    if (call.status !== "waiting") return;

    const departmentId = call.departmentId;
    if (departmentId == null) return;

    const departmentsSnap = await db
      .collection("departments")
      .where("departmentId", "==", departmentId)
      .get();

    const tokens = [];
    departmentsSnap.forEach((doc) => {
      const token = doc.data().fcmToken;
      if (token) tokens.push(token);
    });

    if (tokens.length === 0) return;

    const message = {
      notification: {
        title: "📞 Llamada de portería",
        body: `Portería está llamando al departamento ${departmentId}`,
      },
      data: {
        callId,
        departmentId: String(departmentId),
        url: `/resident/${departmentId}`,
      },
      tokens,
      webpush: {
        fcmOptions: {
          link: `/resident/${departmentId}`,
        },
      },
    };

    try {
      const messaging = getMessaging();
      const response = await messaging.sendEachForMulticast(message);
      console.log(`Push enviado a ${response.successCount} dispositivos`);
    } catch (error) {
      console.error("Error enviando push:", error);
    }
  }
);
