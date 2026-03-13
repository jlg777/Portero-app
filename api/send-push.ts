import type { VercelRequest, VercelResponse } from "@vercel/node";
import webpush from "web-push";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const FIREBASE_SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT;

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    "mailto:soporte@portero-app.com",
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

function initFirebase() {
  if (getApps().length > 0) return;
  const cred = FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(FIREBASE_SERVICE_ACCOUNT)
    : undefined;
  initializeApp(cred ? { credential: cert(cred) } : {});
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { callId, departmentId } = req.body as {
    callId?: string;
    departmentId?: number;
  };

  if (!callId || departmentId == null) {
    return res.status(400).json({
      error: "Faltan callId o departmentId",
    });
  }

  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return res.status(500).json({
      error: "VAPID keys no configuradas. Añade VAPID_PUBLIC_KEY y VAPID_PRIVATE_KEY en Vercel.",
    });
  }

  if (!FIREBASE_SERVICE_ACCOUNT) {
    return res.status(500).json({
      error: "Firebase Service Account no configurado. Añade FIREBASE_SERVICE_ACCOUNT en Vercel.",
    });
  }

  try {
    initFirebase();
    const db = getFirestore();

    const departmentsSnap = await db
      .collection("departments")
      .where("departmentId", "==", departmentId)
      .get();

    const subscriptions: webpush.PushSubscription[] = [];
    departmentsSnap.forEach((doc) => {
      const sub = doc.data().pushSubscription;
      if (sub && sub.endpoint) {
        subscriptions.push(sub as webpush.PushSubscription);
      }
    });

    if (subscriptions.length === 0) {
      return res.status(200).json({
        success: true,
        sent: 0,
        message: "No hay dispositivos suscritos para este departamento",
      });
    }

    const payload = JSON.stringify({
      title: "📞 Llamada de portería",
      body: `Portería está llamando al departamento ${departmentId}`,
      data: {
        callId,
        departmentId: String(departmentId),
        url: `/resident/${departmentId}`,
      },
    });

    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        webpush.sendNotification(sub, payload, {
          TTL: 60,
        })
      )
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;

    return res.status(200).json({
      success: true,
      sent,
      total: subscriptions.length,
    });
  } catch (error) {
    console.error("Error enviando push:", error);
    return res.status(500).json({
      error: "Error enviando notificación",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
