import { useState } from "react"
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import { IconBell, IconMenu2 } from "@workspace/ui/lib/Icons"

// ---------------------------------------------------------------------------
// Nav config — adjust labels/hrefs/icons to match your routes
// ---------------------------------------------------------------------------

const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: "ti-layout-dashboard" },
  { label: "Metrics", href: "/metrics", icon: "ti-chart-bar" },
  { label: "Audit", href: "/audit", icon: "ti-clipboard-list" },
  { label: "Settings", href: "/settings", icon: "ti-settings" },
] as const

// ---------------------------------------------------------------------------
// Helpers
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
// NavLink — shared between desktop header and mobile drawer
// ---------------------------------------------------------------------------

function NavLink({
  href,
  label,
  onClick,
}: {
  href: string
  label: string
  icon: string
  onClick?: () => void
}) {
  const { pathname } = useLocation()
  const active = pathname === href || pathname.startsWith(href + "/")

  return (
    <Link
      to={href}
      onClick={onClick}
      className={[
        "flex items-center rounded-md px-3 py-2 text-sm transition-all duration-200",
        active
          ? "bg-indigo-50 font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
          : "text-zinc-500 font-medium hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
      ].join(" ")}
    >
      {label}
    </Link>
  )
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

export function Header() {
  const { user, logout } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4 sm:px-6">
      {/* ── Left: logo + desktop nav ──────────────────────────────────────── */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <Link
          to="/dashboard"
          className="group flex shrink-0 items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <div className="relative flex h-10 w-10 transform-gpu items-center justify-center overflow-hidden rounded-xl border border-border/50 bg-white shadow-sm transition-all group-hover:scale-105 group-hover:rotate-3">
            <img
              src="/unbound_logo.webp"
              alt="Unbound Script Logo"
              className="h-7 w-7 object-contain antialiased"
            />
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-xl font-black tracking-tighter uppercase">
              Unbound
            </span>
            <span className="ml-0.5 text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase">
              Script
            </span>
          </div>
        </Link>

        {/* Desktop nav — hidden on mobile */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>
      </div>

      {/* ── Right: notifications + avatar + hamburger ─────────────────────── */}
      <div className="flex items-center gap-1">
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
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
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

        {/* Hamburger — mobile only */}
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 md:hidden"
              aria-label="Open menu"
            >
              <IconMenu2 className="h-4 w-4" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-64 p-0">
            {/* Drawer header */}
            <div className="flex h-14 items-center justify-between border-b px-4">
              <Link
                to="/dashboard"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-2 text-sm font-semibold"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-[11px] font-bold text-primary-foreground">
                  A
                </div>
                Unbound
              </Link>
            </div>

            {/* Drawer nav */}
            <nav
              aria-label="Mobile navigation"
              className="flex flex-col gap-1 p-3"
            >
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  {...link}
                  onClick={() => setDrawerOpen(false)}
                />
              ))}
            </nav>

            {/* Drawer footer — user info */}
            <div className="absolute right-0 bottom-0 left-0 border-t p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                  {getInitials(user?.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {user?.name ?? "Account"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user?.username}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                  aria-label="Log out"
                  onClick={logout}
                >
                  <i className="ti ti-logout text-base" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
