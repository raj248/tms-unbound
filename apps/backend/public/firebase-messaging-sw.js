// public/firebase-messaging-sw.js

importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"
)
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js"
)

// Your project credentials
firebase.initializeApp({
  apiKey: "AIzaSyBbD08-ybELKBly9fL-dDTR0ZuEtHaiINg",
  authDomain: "todo-list-7ea7b.firebaseapp.com",
  projectId: "todo-list-7ea7b",
  storageBucket: "todo-list-7ea7b.firebasestorage.app",
  messagingSenderId: "281655859017",
  appId: "1:281655859017:web:e5cfab041a2c50d23e2c98",
  // Note: vapidKey is usually used in the frontend getToken call,
  // but including it here doesn't hurt if your setup requires it.
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
  // console.log("[SW] Received background message ", payload);

  // Default values if notification object is missing
  const { title, body } = payload.notification || {
    title: "New Notification",
    body: "",
  }

  // Logic: Show the notification with background suffix for debugging
  return self.registration.showNotification(title, {
    ...payload.notification,
    // Ensure we don't break if icon path was /public/...
    image: payload.notification?.image || "/unbound-logo.png",
    icon: payload.notification?.icon || "/unbound-logo.png",
    badge:
      payload.notification?.badge ||
      payload.notification?.icon ||
      "/unbound-logo.png",

    data: { ...payload.data },
    // Safeguard against undefined actions
    actions: payload.notification?.actions
      ? [...payload.notification.actions]
      : [],
  })
})

self.addEventListener("notificationclick", function (event) {
  event.notification.close()
  // console.log("SW notificationclick", event);

  // Parsing the URL from the data payload
  // Firebase often nests data under FCM_MSG
  let url =
    event.notification.data?.FCM_MSG?.data?.url ||
    event.notification.data?.url ||
    "/"

  if (event.action === "_first") {
    url = event.notification.data?.FCM_MSG?.data?.url1 || url
  } else if (event.action === "_second") {
    url = event.notification.data?.FCM_MSG?.data?.url2 || url
  }

  event.waitUntil(
    (async () => {
      const allClients = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      })

      // Focus existing tab if open
      for (const client of allClients) {
        if (client.url === url && "focus" in client) {
          return client.focus()
        }
      }

      // Otherwise open new
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })()
  )
})
