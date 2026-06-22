import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"
import { Separator } from "@workspace/ui/components/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import {
  IconUser,
  IconBuilding,
  IconAlertCircle,
  IconPlus,
  IconTrash,
  IconSwitchHorizontal,
  IconSettings,
} from "@tabler/icons-react"

import { mockUsers, mockDepartments } from "@workspace/types/src/mockData"
import { useAuth } from "@/context/auth-context"
import NotificationSettings from "@/components/Settings/NotificationSetting"

// ---------------------------------------------------------------------------
// Settings page
// ---------------------------------------------------------------------------
export default function Settings() {
  const { user } = useAuth()

  const tabs = [
    {
      value: "general",
      label: "General",
      icon: <IconSettings className="h-4 w-4 shrink-0" />,
    },
    {
      value: "users",
      label: "User Management",
      icon: <IconUser className="h-4 w-4 shrink-0" />,
    },
    {
      value: "departments",
      label: "Departments",
      icon: <IconBuilding className="h-4 w-4 shrink-0" />,
    },
    {
      value: "security",
      label: "Security",
      icon: <IconAlertCircle className="h-4 w-4 shrink-0" />,
      destructive: true,
    },
  ]

  return (
    <div className="mx-auto max-w-5xl flex-1 space-y-6 p-6 md:p-8">
      {/* Page header */}
      <header className="flex items-center gap-3 border-b pb-5">
        <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-900">
          <IconSwitchHorizontal className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account, preferences, and system configuration.
          </p>
        </div>
      </header>

      {/* Tabs — always side-by-side, sidebar left */}
      <Tabs
        defaultValue="general"
        orientation="vertical"
        className="flex flex-row items-start gap-6"
      >
        {/* ── Left sidebar — always visible, never stacks ── */}
        <TabsList className="flex h-auto w-12 shrink-0 flex-col gap-1 rounded-xl border bg-zinc-100/80 p-1 sm:w-48 dark:bg-zinc-900/50">
          {tabs.map(({ value, label, icon, destructive }) => (
            <TabsTrigger
              key={value}
              value={value}
              className={[
                "w-full justify-center gap-2.5 rounded-lg px-2 py-2.5 text-sm transition-all sm:justify-start sm:px-3",
                "data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-950",
                destructive
                  ? "text-destructive data-[state=active]:text-destructive"
                  : "",
              ].join(" ")}
            >
              {icon}
              <span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ── Right content area ── */}
        <div className="min-w-0 flex-1">
          {/* TAB 1 — General */}
          <TabsContent value="general" className="mt-0 space-y-5">
            <Card>
              <CardHeader className="border-b pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconUser className="h-4 w-4 text-muted-foreground" />
                  Profile Details
                </CardTitle>
                <CardDescription>
                  Your current account identity and login credentials.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-5">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-zinc-100 text-lg dark:bg-zinc-800">
                      {user?.name?.charAt(0) ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg leading-none font-semibold">
                      {user?.name ?? "Unnamed User"}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      @{user?.username}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                      Full Name
                    </span>
                    <p className="rounded-md border bg-zinc-50/50 p-2 text-sm font-medium dark:bg-zinc-900/50">
                      {user?.name ?? "—"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                      Username Handle
                    </span>
                    <p className="rounded-md border bg-zinc-50/50 p-2 text-sm font-medium dark:bg-zinc-900/50">
                      @{user?.username}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <NotificationSettings />
          </TabsContent>

          {/* TAB 2 — Users */}
          <TabsContent value="users" className="mt-0 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-4">
                <div>
                  <CardTitle className="text-base">User Directory</CardTitle>
                  <CardDescription>
                    Accounts authorized to manage system task queues.
                  </CardDescription>
                </div>
                <Button size="sm" className="shrink-0 gap-2">
                  <IconPlus className="h-4 w-4" /> Add user
                </Button>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {mockUsers.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="text-xs">
                            {u.name?.charAt(0) ?? "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm leading-none font-medium">
                            {u.name || "Unnamed"}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            @{u.username}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
                            u.role === "ADMIN"
                              ? "border-amber-500/20 bg-amber-500/10 text-amber-600"
                              : "border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                          }`}
                        >
                          {u.role}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3 — Departments */}
          <TabsContent value="departments" className="mt-0 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-4">
                <div>
                  <CardTitle className="text-base">Departments</CardTitle>
                  <CardDescription>
                    Teams used to group and direct incoming assignment streams.
                  </CardDescription>
                </div>
                <Button size="sm" className="shrink-0 gap-2">
                  <IconPlus className="h-4 w-4" /> New department
                </Button>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  {mockDepartments.map((dept) => (
                    <div
                      key={dept.id}
                      className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm dark:bg-zinc-900/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-sm font-medium">{dept.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4 — Security */}
          <TabsContent value="security" className="mt-0">
            <Card className="border-zinc-200 dark:border-zinc-800">
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-base">
                  Session Configuration
                </CardTitle>
                <CardDescription>
                  Configure authentication boundaries and idle session limits.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">
                      Session Timeout
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically terminate idle sessions after a set period.
                    </p>
                  </div>
                  <Select defaultValue="60">
                    <SelectTrigger className="w-full sm:w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="justify-end border-t bg-zinc-50 px-6 py-3 dark:bg-zinc-900/50">
                <Button size="sm">Save security rules</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
