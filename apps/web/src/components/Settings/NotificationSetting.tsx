import { IconBell, IconBellOff } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@workspace/ui/components/card"
import { useState, useEffect } from "react"
// Import other required Shadcn components...

export default function NotificationSettings() {
  const [permission, setPermission] = useState<
    NotificationPermission | "default"
  >("default")

  // Sync state with browser on mount
  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const handleRequestPermission = async () => {
    if (!("Notification" in window)) return

    const result = await Notification.requestPermission()
    setPermission(result)
  }

  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <IconBell className="h-4 w-4 text-muted-foreground" />
          System Notifications
        </CardTitle>
        <CardDescription>
          Enable real-time push alerts for task updates, assignments, and
          mention streams.
        </CardDescription>
      </CardHeader>

      <CardContent className="mx-auto flex max-w-sm flex-col items-center space-y-4 pt-6 text-center">
        {/* STATE 1: ALREADY GRANTED */}
        {permission === "granted" && (
          <>
            <div className="rounded-full bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <IconBell className="h-6 w-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                Push Alerts Enabled
              </h4>
              <p className="text-xs text-muted-foreground">
                Live workspace updates, deadline signals, and system metrics are
                directly routed to your operating system notifications.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              disabled
              className="w-full sm:w-auto"
            >
              Permission Active
            </Button>
          </>
        )}

        {/* STATE 2: BLOCKED / DENIED */}
        {permission === "denied" && (
          <>
            <div className="rounded-full bg-destructive/10 p-3 text-destructive">
              <IconBellOff className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-destructive">
                Notifications Blocked
              </h4>
              <p className="text-xs text-muted-foreground">
                You previously denied notification access. You must manually
                reset the site permissions in your browser address bar panel to
                toggle them back on.
              </p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              disabled
              className="w-full sm:w-auto"
            >
              Blocked by Browser
            </Button>
          </>
        )}

        {/* STATE 3: DEFAULT (NOT REQUESTED YET) */}
        {permission === "default" && (
          <>
            <div className="rounded-full bg-zinc-100 p-3 text-muted-foreground dark:bg-zinc-900">
              <IconBell className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">Push Alerts Disabled</h4>
              <p className="text-xs text-muted-foreground">
                Grant the application browser permission to deliver assignments
                and commentary updates instantly.
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleRequestPermission}
              className="w-full sm:w-auto"
            >
              Enable System Notifications
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
