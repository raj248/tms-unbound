import { useState } from "react"
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
} from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Separator } from "@workspace/ui/components/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import {
  IconUser,
  IconBuilding,
  IconPlus,
  IconTrash,
  IconSwitchHorizontal,
  IconSettings,
  IconLoader2,
} from "@tabler/icons-react"

import { useAuth } from "@/context/auth-context"
import NotificationSettings from "@/components/Settings/NotificationSetting"
import { useUsers, useCreateUser, useDeleteUser } from "@/hooks/user"
import {
  useDepartments,
  useCreateDepartment,
  useDeleteDepartment,
} from "@/hooks/department"
import type {
  CreateUserRequest,
  CreateDepartmentRequest,
  Role,
} from "@workspace/types"

// ---------------------------------------------------------------------------
// Add User Dialog
// ---------------------------------------------------------------------------

function AddUserDialog() {
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<Role>("USER")
  const [departmentId, setDepartmentId] = useState("")
  const [error, setError] = useState("")

  const { mutate: createUser, isPending } = useCreateUser()
  const { data: departments = [], isLoading: loadingDepts } = useDepartments()

  function reset() {
    setUsername("")
    setName("")
    setPassword("")
    setRole("USER")
    setDepartmentId("")
    setError("")
  }

  function handleSubmit() {
    if (!username.trim()) return setError("Username is required.")
    if (!name.trim()) return setError("Full name is required.")
    if (!password.trim()) return setError("Password is required.")
    if (!departmentId) return setError("Department is required.")

    const payload: CreateUserRequest = {
      username: username.trim(),
      name: name.trim(),
      password: password.trim(),
      role,
      departmentId,
    }

    createUser(payload, {
      onSuccess: () => {
        reset()
        setOpen(false)
      },
      onError: (err: any) => {
        setError(err.response.data.message)
      },
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) reset()
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="shrink-0 gap-2">
          <IconPlus className="h-4 w-4" /> Add user
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="border-b px-6 py-5">
          <DialogTitle className="text-base font-semibold">
            Add New User
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 px-6 py-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Username <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="User handle"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setError("")
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="Display name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError("")
                }}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Password <span className="text-destructive">*</span>
            </Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError("")
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Department <span className="text-destructive">*</span>
              </Label>
              <Select
                value={departmentId}
                onValueChange={(v) => {
                  setDepartmentId(v)
                  setError("")
                }}
                disabled={loadingDepts}
              >
                <SelectTrigger
                  className={`w-full ${!departmentId && error ? "border-destructive" : ""}`}
                >
                  <SelectValue
                    placeholder={loadingDepts ? "Loading…" : "Select…"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Role
              </Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
        <DialogFooter className="border-t bg-zinc-50 px-6 py-3 dark:bg-zinc-900/50">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending} className="gap-2">
            {isPending && <IconLoader2 className="h-3.5 w-3.5 animate-spin" />}
            Create User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Add Department Dialog
// ---------------------------------------------------------------------------

function AddDepartmentDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  const { mutate: createDepartment, isPending } = useCreateDepartment()

  function reset() {
    setName("")
    setError("")
  }

  function handleSubmit() {
    if (!name.trim()) return setError("Department name is required.")

    const payload: CreateDepartmentRequest = { name: name.trim() }

    createDepartment(payload, {
      onSuccess: () => {
        reset()
        setOpen(false)
      },
      onError: () => setError("Failed to create department. Please try again."),
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) reset()
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="shrink-0 gap-2">
          <IconPlus className="h-4 w-4" /> New department
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-sm">
        <DialogHeader className="border-b px-6 py-5">
          <DialogTitle className="text-base font-semibold">
            New Department
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 px-6 py-5">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Department Name <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="e.g. Engineering"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError("")
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        </div>
        <DialogFooter className="border-t bg-zinc-50 px-6 py-3 dark:bg-zinc-900/50">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending} className="gap-2">
            {isPending && <IconLoader2 className="h-3.5 w-3.5 animate-spin" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Delete confirm — reusable
// ---------------------------------------------------------------------------

function DeleteConfirm({
  label,
  onConfirm,
  isPending,
}: {
  label: string
  onConfirm: () => void
  isPending: boolean
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          disabled={isPending}
        >
          {isPending ? (
            <IconLoader2 className="h-4 w-4 animate-spin" />
          ) : (
            <IconTrash className="h-4 w-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {label}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove{" "}
            <span className="font-medium text-foreground">"{label}"</span>. This
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
            onClick={onConfirm}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ---------------------------------------------------------------------------
// Settings page
// ---------------------------------------------------------------------------

export default function Settings() {
  const { user } = useAuth()

  const { data: users = [], isLoading: loadingUsers } = useUsers()
  const { data: departments = [], isLoading: loadingDepts } = useDepartments()
  const { mutate: deleteUser, isPending: deletingUser } = useDeleteUser()
  const { mutate: deleteDepartment, isPending: deletingDept } =
    useDeleteDepartment()

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
    // {
    //   value: "security",
    //   label: "Security",
    //   icon: <IconAlertCircle className="h-4 w-4 shrink-0" />,
    //   destructive: true,
    // },
  ]

  return (
    <div className="mx-auto max-w-5xl flex-1 space-y-6 p-6 md:p-8">
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

      <Tabs
        defaultValue="general"
        orientation="vertical"
        className="flex flex-row items-start gap-6"
      >
        {/* Sidebar */}
        <TabsList className="flex h-auto w-12 shrink-0 flex-col gap-1 rounded-xl border bg-zinc-100/80 p-1 sm:w-48 dark:bg-zinc-900/50">
          {tabs.map(({ value, label, icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className={[
                "w-full justify-center gap-2.5 rounded-lg px-2 py-2.5 text-sm transition-all sm:justify-start sm:px-3",
                "data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-950",
                // destructive
                //   ? "text-destructive data-[state=active]:text-destructive"
                //   : "",
              ].join(" ")}
            >
              {icon}
              <span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="min-w-0 flex-1">
          {/* ── TAB 1: General ── */}
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
                      {user?.username}
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
                      {user?.username}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <NotificationSettings />
          </TabsContent>

          {/* ── TAB 2: Users ── */}
          <TabsContent value="users" className="mt-0 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-4">
                <div>
                  <CardTitle className="text-base">User Directory</CardTitle>
                  <CardDescription>
                    Accounts authorized to manage system task queues.
                  </CardDescription>
                </div>
                <AddUserDialog />
              </CardHeader>
              <CardContent className="pt-5">
                {loadingUsers ? (
                  <div className="flex items-center justify-center py-10 text-muted-foreground">
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="text-sm">Loading users…</span>
                  </div>
                ) : users.length === 0 ? (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    No users found.
                  </p>
                ) : (
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {users.map((u) => {
                      // Helper resolver: Safely pulls the department from the user payload or falls back to lookups
                      const departmentName =
                        u.departments?.[0]?.name ??
                        departments.find(
                          (d) => d.id === (u as any).departmentId
                        )?.name ??
                        "No Department"

                      return (
                        <div
                          key={u.id}
                          className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarFallback className="text-xs">
                                {u.name?.charAt(0) ??
                                  u.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="truncate text-sm leading-none font-medium">
                                {u.name || "Unnamed"}
                              </p>
                              {/* Added a metadata line displaying Username & Resolved Department Name */}
                              <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                                <span>@{u.username}</span>
                                <span className="text-zinc-300 dark:text-zinc-700">
                                  •
                                </span>
                                <span className="rounded bg-zinc-100/70 px-1.5 py-0.5 font-medium text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400">
                                  {departmentName}
                                </span>
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
                            <DeleteConfirm
                              label={u.name ?? u.username}
                              isPending={deletingUser}
                              onConfirm={() => deleteUser(u.id)}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── TAB 3: Departments ── */}
          <TabsContent value="departments" className="mt-0 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-4">
                <div>
                  <CardTitle className="text-base">Departments</CardTitle>
                  <CardDescription>
                    Teams used to group and direct incoming assignment streams.
                  </CardDescription>
                </div>
                <AddDepartmentDialog />
              </CardHeader>
              <CardContent className="pt-5">
                {loadingDepts ? (
                  <div className="flex items-center justify-center py-10 text-muted-foreground">
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="text-sm">Loading departments…</span>
                  </div>
                ) : departments.length === 0 ? (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    No departments found.
                  </p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {departments.map((dept) => (
                      <div
                        key={dept.id}
                        className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm dark:bg-zinc-900/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          <span className="text-sm font-medium">
                            {dept.name}
                          </span>
                        </div>
                        <DeleteConfirm
                          label={dept.name}
                          isPending={deletingDept}
                          onConfirm={() => deleteDepartment(dept.id)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── TAB 4: Security ── */}
          {/* <TabsContent value="security" className="mt-0">
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
          </TabsContent> */}
        </div>
      </Tabs>
    </div>
  )
}
