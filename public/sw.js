// Preter Service Worker

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Push notification handler
self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload = {};
  try {
    payload = event.data.json();
  } catch {
    payload = { title: 'Preter', body: event.data.text(), url: '/' };
  }

  const title = payload.title || 'Preter';
  const options = {
    body: payload.body || 'You have a new message',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: payload.chatId || 'Preter',
    data: { url: payload.url || '/', chatId: payload.chatId },
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click — open/focus the relevant chat
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
