import { initializeApp } from "firebase/app"
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging"
import { toast } from "@workspace/ui/components/sonner"
import api from "@/lib/api"
import { useEffect, useState } from "react"

// ---------------------------------------------------------------------------
// Config — move these to .env as VITE_FIREBASE_* (or NEXT_PUBLIC_FIREBASE_*)
// ---------------------------------------------------------------------------

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY

// ---------------------------------------------------------------------------
// Firebase app — initialised once at module level
// ---------------------------------------------------------------------------

const firebaseApp = initializeApp(firebaseConfig)

// Safely get messaging — returns null in unsupported environments (SSR, Safari < 16, etc.)
const getSafeMessaging = async () => {
  const supported = await isSupported()
  if (!supported) return null
  return getMessaging(firebaseApp)
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export const usePushNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "denied"
  )

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission)
    }
  }, [])
  /**
   * Request notification permission, register the service worker,
   * obtain an FCM token, and persist it to the backend if it changed.
   */
  const requestPermission = async (): Promise<string | null> => {
    if (
      typeof window === "undefined" ||
      !("Notification" in window) ||
      !("serviceWorker" in navigator)
    ) {
      console.warn("[Push] Browser does not support push notifications.")
      return null
    }

    try {
      const messaging = await getSafeMessaging()
      if (!messaging) {
        console.warn("[Push] FCM messaging is unsupported on this browser.")
        return null
      }

      const status = await Notification.requestPermission()
      setPermission(status)

      if (status !== "granted") {
        toast.error("Notification permission denied.")
        return null
      }

      const reg = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      )
      await reg.update()

      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: reg,
      })

      if (!token) {
        console.warn("[Push] No FCM token obtained.")
        return null
      }

      // Only sync to backend if the token changed
      const storedToken = localStorage.getItem("fcm_token")
      if (storedToken !== token) {
        await api.post("/user/save-token", { token })
        localStorage.setItem("fcm_token", token)
      }

      return token
    } catch (err) {
      console.error("[Push] Setup failed:", err)
      return null
    }
  }

  /**
   * Subscribe to foreground messages.
   * Call this once on mount (e.g. in MainLayout) and use the returned
   * unsubscribe function in a useEffect cleanup.
   *
   * @returns unsubscribe function, or a no-op if unsupported
   */
  const onForegroundMessage = async (): Promise<() => void> => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return () => {}
    }

    const messaging = await getSafeMessaging()
    if (!messaging) return () => {}

    const unsubscribe = onMessage(messaging, (payload) => {
      const title = payload.notification?.title ?? "New notification"
      const body = payload.notification?.body

      // In-app toast
      toast(title, { description: body })

      // Native browser notification (shown even when tab is focused)
      if (Notification.permission === "granted" && payload.notification) {
        const notif = new Notification(title, {
          body,
          icon: payload.notification.image ?? "/unbound-logo.png",
          badge: "/unbound-logo.png",
          tag: payload.data?.notificationId ?? "tms-notif",
          data: payload.data ?? {},
          requireInteraction: false,
          silent: false,
        })

        notif.onclick = (e) => {
          e.preventDefault()
          const url =
            (e.target as Notification & { data?: { url?: string } })?.data
              ?.url ?? "/"
          window.open(url, "_blank")
          notif.close()
        }
      }
    })

    return unsubscribe
  }

  return { requestPermission, onForegroundMessage, permission }
}
