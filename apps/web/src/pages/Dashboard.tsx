import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import {
  IconCreditCard,
  IconUser,
  IconDashboard,
  IconActivity,
  IconSettings,
  IconLogout,
  IconBell,
} from "@workspace/ui/lib/Icons"

export default function Dashboard() {
  // Dummy data for metric blocks
  const metrics = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      desc: "+20.1% from last month",
      icon: IconCreditCard,
    },
    {
      title: "Subscriptions",
      value: "+2,350",
      desc: "+180.1% from last month",
      icon: IconUser,
    },
    {
      title: "Active Sales",
      value: "+12,234",
      desc: "+19% from last month",
      icon: IconDashboard,
    },
    {
      title: "Active Now",
      value: "+573",
      desc: "+201 since last hour",
      icon: IconActivity,
    },
  ]

  // Dummy data for recent activity
  const recentSales = [
    {
      name: "Olivia Martin",
      email: "olivia.martin@email.com",
      amount: "+$1,999.00",
    },
    { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00" },
    {
      name: "Isabella Nguyen",
      email: "isabella.nguyen@email.com",
      amount: "+$299.00",
    },
    { name: "William Kim", email: "will@email.com", amount: "+$99.00" },
  ]

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* 1. Sidebar Navigation */}
      <aside className="hidden w-64 border-r bg-white p-6 md:block dark:bg-zinc-900">
        <div className="flex h-full flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-2 px-2">
              <IconDashboard className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight">
                Workspace OS
              </span>
            </div>

            <nav className="space-y-1">
              <Button
                variant="secondary"
                className="w-full justify-start gap-3"
              >
                <IconDashboard className="h-4 w-4" />
                Overview
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
              >
                <IconUser className="h-4 w-4" />
                Customers
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
              >
                <IconSettings className="h-4 w-4" />
                Settings
              </Button>
            </nav>
          </div>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <IconLogout className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 space-y-6 p-6 md:p-8">
        {/* Top Navbar Header */}
        <header className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back to your workspace overview.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <IconBell className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* 3. Metrics Summary Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((item, index) => {
            const Icon = item.icon
            return (
              <Card key={index} className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {item.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.value}</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* 4. Data Content Overview Block */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Main Visual Display Block placeholder */}
          <Card className="col-span-4 shadow-sm">
            <CardHeader>
              <CardTitle>Overview Graph</CardTitle>
              <CardDescription>
                Product sales performance metrics tracked across this fiscal
                quarter.
              </CardDescription>
            </CardHeader>
            <CardContent className="m-6 mt-0 flex h-[240px] items-center justify-center rounded-md border-2 border-dashed bg-zinc-50/50 dark:bg-zinc-900/50">
              <span className="text-sm text-muted-foreground">
                [ Chart Component Insertion Point ]
              </span>
            </CardContent>
          </Card>

          {/* Recent Activity List block */}
          <Card className="col-span-3 shadow-sm">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>You made 265 sales this month.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {recentSales.map((sale, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm leading-none font-medium">
                      {sale.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {sale.email}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {sale.amount}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
