import type { VercelRequest, VercelResponse } from "@vercel/node";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const FIREBASE_SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT;

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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { departmentId, subscription } = req.body;

  if (!departmentId || !subscription) {
    return res.status(400).json({
      error: "Faltan datos",
    });
  }

  try {
    initFirebase();
    const db = getFirestore();

    await db
      .collection("departments")
      .doc(String(departmentId))
      .set(
        {
          departmentId,
          pushSubscription: subscription,
        },
        { merge: true }
      );

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error guardando suscripción",
    });
  }
}