#!/usr/bin/env node
/**
 * Genera un par de claves VAPID para Web Push.
 * Ejecutar: node scripts/generate-vapid.js
 *
 * Copia las claves a .env y a las variables de entorno de Vercel.
 */
import webpush from "web-push";

const vapidKeys = webpush.generateVAPIDKeys();

console.log("\n=== Claves VAPID generadas ===\n");
console.log("Añade estas líneas a tu archivo .env:");
console.log("");
console.log(`VITE_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
console.log(`VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`);
console.log("");
console.log("En Vercel > Settings > Environment Variables, añade:");
console.log("  - VAPID_PUBLIC_KEY");
console.log("  - VAPID_PRIVATE_KEY");
console.log("  - FIREBASE_SERVICE_ACCOUNT (JSON completo de la cuenta de servicio)");
console.log("");
