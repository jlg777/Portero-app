/// <reference lib="webworker" />
import { precacheAndRoute } from "workbox-precaching";

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: { url: string; revision?: string }[];
};

// Precache de la PWA
precacheAndRoute(self.__WB_MANIFEST);

// Web Push estándar - evento push
self.addEventListener("push", (event: PushEvent) => {
  if (!event.data) return;

  let data: { title?: string; body?: string; data?: Record<string, string> };
  try {
    data = event.data.json();
  } catch {
    return;
  }

  const title = data?.title ?? "Portero";
  const body = data?.body ?? "Llamada entrante de portería";

  const options: NotificationOptions & {
    data?: Record<string, string>;
    actions?: { action: string; title: string }[];
  } = {
    body,
    icon: "/icons/icon.svg",
    badge: "/icons/icon.svg",
    tag: "portero-call",
    requireInteraction: true,
    data: data?.data ?? {},
    actions: [
      { action: "accept", title: "Atender" },
      { action: "reject", title: "Rechazar" },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Click en la notificación -> abrir app
self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();

  const data = (event.notification.data ?? {}) as Record<string, string>;
  const departmentId = data.departmentId ?? "";
  const urlToOpen = data.url ?? (departmentId ? `/resident/${departmentId}` : "/");

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});
