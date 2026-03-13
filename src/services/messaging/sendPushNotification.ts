/**
 * Llama a la API de Vercel para enviar push al residente.
 * Se ejecuta desde el cliente (portero) después de crear la llamada.
 */
export async function sendPushToResident(
  callId: string,
  departmentId: number
): Promise<{ success: boolean; sent?: number }> {
  const baseUrl =
    import.meta.env.VITE_API_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");

  const res = await fetch(`${baseUrl}/api/send-push`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callId, departmentId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Error enviando notificación");
  }

  return data;
}
