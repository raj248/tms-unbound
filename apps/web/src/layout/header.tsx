// import { Bell } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "@/context/auth-context"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { IconBell } from "@workspace/ui/lib/Icons"

// ---------------------------------------------------------------------------
// Breadcrumb helpers
// ---------------------------------------------------------------------------

const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  admin: "Admin",
  author: "Author",
  books: "Books",
  profile: "Profile",
  settings: "Settings",
  timeline: "Timeline",
  authors: "Authors",
  onboarding: "Onboarding",
  export: "Export",
}

function useBreadcrumbs() {
  const { pathname } = useLocation()
  const segments = pathname.split("/").filter(Boolean)

  return segments.map((seg, i) => ({
    label: ROUTE_LABELS[seg] ?? seg,
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }))
}

// ---------------------------------------------------------------------------
// Avatar initials helper
// ---------------------------------------------------------------------------

function getInitials(name?: string) {
  if (!name) return "?"
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

// ---------------------------------------------------------------------------
// Mock notifications — replace with real data / hook
// ---------------------------------------------------------------------------

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    title: "New book submitted",
    body: "Jane Doe submitted Rust & Rain",
    time: "2m ago",
    read: false,
  },
  {
    id: "2",
    title: "Review approved",
    body: "Your review was published",
    time: "1h ago",
    read: false,
  },
  {
    id: "3",
    title: "Profile updated",
    body: "Changes saved successfully",
    time: "3h ago",
    read: true,
  },
]

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

export function Header() {
  const { user, logout } = useAuth()
  const breadcrumbs = useBreadcrumbs()
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-6">
      {/* Left — logo + breadcrumbs */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          {/* Replace with your actual logo/icon */}
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-[11px] font-bold text-primary-foreground">
            A
          </div>
          <span className="hidden sm:inline">Acme</span>
        </Link>

        {/* Divider */}
        {breadcrumbs.length > 0 && (
          <span className="text-muted-foreground/40 select-none">/</span>
        )}

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <li key={crumb.href} className="flex items-center gap-1">
                {i > 0 && (
                  <span className="text-muted-foreground/40 select-none">
                    /
                  </span>
                )}
                {crumb.isLast ? (
                  <span className="font-medium text-foreground">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Right — notifications + avatar */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8"
              aria-label="Notifications"
            >
              <IconBell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-2 w-2 items-center justify-center rounded-full bg-destructive text-[9px] text-white" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <p className="text-sm font-medium">Notifications</p>
              {unreadCount > 0 && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {unreadCount} new
                </span>
              )}
            </div>
            <ul className="divide-y">
              {MOCK_NOTIFICATIONS.map((n) => (
                <li
                  key={n.id}
                  className={`flex gap-3 px-4 py-3 text-sm ${!n.read ? "bg-muted/40" : ""}`}
                >
                  {!n.read && (
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  )}
                  <div className={!n.read ? "" : "pl-[18px]"}>
                    <p className="leading-snug font-medium">{n.title}</p>
                    <p className="text-muted-foreground">{n.body}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {n.time}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t px-4 py-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-muted-foreground"
              >
                Mark all as read
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* User avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              aria-label="User menu"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                {getInitials(user?.name)}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-medium">{user?.name ?? "Account"}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.username}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={logout}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
