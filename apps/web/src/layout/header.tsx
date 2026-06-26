import { useState, useRef, useCallback } from "react"
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
import { IconLoader2, IconBellOff, IconCircleDot } from "@tabler/icons-react"
import { useNotifications, useMarkAsRead } from "@/hooks/notification"
import type { NotificationHistoryItem } from "@workspace/types"

// ---------------------------------------------------------------------------
// Nav config
// ---------------------------------------------------------------------------

const getNavLinks = (_role?: string) => [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "ti-layout-dashboard",
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: "ti-list-check",
  },
  { label: "Metrics", href: "/metrics", icon: "ti-chart-bar" },
  { label: "Settings", href: "/settings", icon: "ti-settings" },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(name?: string | null) {
  if (!name) return "?"
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function formatNotifTime(date: string | Date) {
  const d = new Date(date)
  const diffMin = Math.floor((Date.now() - d.getTime()) / 60000)
  if (diffMin < 1) return "just now"
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

// ---------------------------------------------------------------------------
// Single notification row
// ---------------------------------------------------------------------------

function NotifItem({ item }: { item: NotificationHistoryItem }) {
  const { mutate: markAsRead, isPending } = useMarkAsRead()

  return (
    <li
      className={`group flex gap-3 px-4 py-3 text-sm transition-colors hover:bg-muted/50 ${!item.isRead ? "bg-muted/30" : ""}`}
    >
      {/* Unread dot */}
      <div className="mt-1.5 flex w-3 shrink-0 justify-center">
        {!item.isRead && <span className="h-2 w-2 rounded-full bg-primary" />}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 space-y-0.5">
        <p
          className={`leading-snug ${!item.isRead ? "font-semibold text-foreground" : "font-medium text-foreground/80"}`}
        >
          {item.notification.title}
        </p>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {item.notification.body}
        </p>
        <p className="text-[10px] text-muted-foreground/70">
          {item.notification.senderName} ·{" "}
          {formatNotifTime(item.notification.createdAt)}
        </p>
      </div>

      {/* Per-item mark-as-read — hover reveal */}
      {!item.isRead && (
        <button
          onClick={() => markAsRead(item.id)}
          disabled={isPending}
          className="mt-0.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-primary disabled:cursor-not-allowed"
          aria-label="Mark as read"
        >
          {isPending ? (
            <IconLoader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <IconCircleDot className="h-3.5 w-3.5" />
          )}
        </button>
      )}
    </li>
  )
}

// ---------------------------------------------------------------------------
// Notification panel — infinite scroll
// ---------------------------------------------------------------------------

function NotificationPanel() {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useNotifications(20)

  const { mutate: markAsRead } = useMarkAsRead()

  // Flatten pages → flat item list
  const allItems: NotificationHistoryItem[] =
    data?.pages.flatMap((p) => p.data) ?? []
  const unread = allItems.filter((n) => !n.isRead)
  const unreadCount = unread.length

  function handleMarkAllRead() {
    unread.forEach((n) => markAsRead(n.id))
  }

  // IntersectionObserver sentinel for infinite scroll
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect()
      if (!node) return
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      })
      observerRef.current.observe(node)
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  )

  return (
    <>
      {/* Panel header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">Notifications</p>
          {unreadCount > 0 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Scrollable feed */}
      <div className="max-h-[380px] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
            <IconLoader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs">Loading…</span>
          </div>
        ) : allItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
            <IconBellOff className="h-6 w-6 opacity-40" />
            <p className="text-xs">You're all caught up</p>
          </div>
        ) : (
          <>
            <ul className="divide-y">
              {allItems.map((n) => (
                <NotifItem key={n.id} item={n} />
              ))}
            </ul>

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="py-2 text-center">
              {isFetchingNextPage ? (
                <IconLoader2 className="mx-auto h-4 w-4 animate-spin text-muted-foreground" />
              ) : hasNextPage ? (
                <span className="text-[10px] text-muted-foreground">
                  Scroll for more
                </span>
              ) : (
                <span className="text-[10px] text-muted-foreground">
                  All caught up
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// NavLink
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
        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
        active
          ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
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

  // Unread count from first page only — enough for the badge
  const { data: firstPageData } = useNotifications(20)
  const firstPageItems = firstPageData?.pages[0]?.data ?? []
  const unreadCount = firstPageItems.filter((n) => !n.isRead).length

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4 sm:px-6">
      {/* ── Left: logo + desktop nav ── */}
      <div className="flex items-center gap-6">
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

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {getNavLinks(user?.role).map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>
      </div>

      {/* ── Right: notifications + avatar + hamburger ── */}
      <div className="flex items-center gap-1">
        {/* ── Bell ── */}
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
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0" sideOffset={8}>
            <NotificationPanel />
          </PopoverContent>
        </Popover>

        {/* ── Avatar dropdown ── */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              aria-label="User menu"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                {getInitials(user?.name ?? "")}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="z-50 w-56 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl"
          >
            <DropdownMenuLabel className="px-2.5 py-3 font-normal">
              <p className="text-sm font-bold text-zinc-900">
                {user?.name ?? "Account"}
              </p>
              <p className="mt-0.5 truncate text-xs font-medium text-zinc-500">
                {user?.username}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="mx-1 my-1 bg-black" />
            <DropdownMenuItem
              asChild
              className="cursor-pointer rounded-lg px-3 py-2 text-zinc-900 transition-colors hover:text-black"
            >
              <Link to="/settings" className="block w-full text-sm font-medium">
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="mx-1 my-1 bg-black" />
            <DropdownMenuItem
              className="cursor-pointer rounded-lg px-3 py-2 text-sm font-bold text-red-600 transition-colors"
              onClick={logout}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* ── Hamburger — mobile only ── */}
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
            <div className="flex h-14 items-center border-b px-4">
              <Link
                to="/dashboard"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-2 text-sm font-semibold"
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
            </div>
            <nav
              aria-label="Mobile navigation"
              className="flex flex-col gap-1 p-3"
            >
              {getNavLinks(user?.role).map((link) => (
                <NavLink
                  key={link.href}
                  {...link}
                  onClick={() => setDrawerOpen(false)}
                />
              ))}
            </nav>
            <div className="absolute right-0 bottom-0 left-0 border-t p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                  {getInitials(user?.name ?? "")}
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
