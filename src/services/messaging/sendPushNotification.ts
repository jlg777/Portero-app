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

  const url = `${baseUrl}/api/send-push`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callId, departmentId }),
  });

  let data: { error?: string; success?: boolean; sent?: number; message?: string };
  try {
    data = await res.json();
  } catch {
    throw new Error(`API no respondió correctamente (${res.status})`);
  }

  if (!res.ok) {
    const msg = data.error || data.message || `Error ${res.status}`;
    throw new Error(msg);
  }

  return { success: !!data.success, sent: data.sent };
}
