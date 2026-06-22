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
  IconChartBar,
} from "@workspace/ui/lib/Icons"

export default function AdminDashboard() {
  // Dummy data for metric blocks
  const metrics = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      desc: "+20.1% from last month",
      icon: IconCreditCard,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      title: "Subscriptions",
      value: "+2,350",
      desc: "+180.1% from last month",
      icon: IconUser,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      title: "Active Sales",
      value: "+12,234",
      desc: "+19% from last month",
      icon: IconDashboard,
      color: "text-indigo-600",
      bg: "bg-indigo-50 dark:bg-indigo-500/10",
    },
    {
      title: "Active Now",
      value: "+573",
      desc: "+201 since last hour",
      icon: IconActivity,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-500/10",
    },
  ]

  // Dummy data for recent activity
  const recentSales = [
    {
      name: "Olivia Martin",
      email: "olivia.martin@email.com",
      amount: "+$1,999.00",
      initials: "OM",
    },
    { 
      name: "Jackson Lee", 
      email: "jackson.lee@email.com", 
      amount: "+$39.00",
      initials: "JL",
    },
    {
      name: "Isabella Nguyen",
      email: "isabella.nguyen@email.com",
      amount: "+$299.00",
      initials: "IN",
    },
    { 
      name: "William Kim", 
      email: "will@email.com", 
      amount: "+$99.00",
      initials: "WK",
    },
    { 
      name: "Sofia Davis", 
      email: "sofia.davis@email.com", 
      amount: "+$39.00",
      initials: "SD",
    },
  ]

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] -m-6 bg-zinc-50/30 dark:bg-zinc-950/30">
      {/* 2. Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="space-y-8">
          
          {/* Top Navbar Header */}
          <header className="flex items-end justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">Dashboard</h1>
              <p className="text-base text-zinc-500 dark:text-zinc-400">
                Welcome back, here's what's happening today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Optional actions could go here */}
            </div>
          </header>

          {/* 3. Metrics Summary Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((item, index) => {
              const Icon = item.icon
              return (
                <Card key={index} className="shadow-sm border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden transition-all hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white/50 dark:bg-zinc-900/50">
                    <CardTitle className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                      {item.title}
                    </CardTitle>
                    <div className={`p-2 rounded-xl ${item.bg} transition-transform group-hover:scale-110`}>
                      <Icon className={`h-4 w-4 ${item.color}`} stroke={2.5} />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 bg-white dark:bg-zinc-900">
                    <div className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{item.value}</div>
                    <p className="mt-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                      <span className="text-emerald-600 font-semibold">{item.desc.split(' ')[0]}</span>
                      {item.desc.substring(item.desc.indexOf(' '))}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* 4. Data Content Overview Block */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-7">
            {/* Main Visual Display Block placeholder */}
            <Card className="col-span-4 shadow-sm border-zinc-200/60 dark:border-zinc-800/60">
              <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 pb-5 bg-white dark:bg-zinc-900">
                <CardTitle className="text-lg font-bold">Revenue Overview</CardTitle>
                <CardDescription className="text-zinc-500">
                  Product sales performance tracked across this fiscal quarter.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-white dark:bg-zinc-900">
                <div className="flex h-[300px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950/50">
                  <div className="rounded-full bg-indigo-50 p-3 mb-3 dark:bg-indigo-500/10">
                    <IconChartBar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Interactive Chart Area
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity List block */}
            <Card className="col-span-3 shadow-sm border-zinc-200/60 dark:border-zinc-800/60">
              <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 pb-5 bg-white dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold">Recent Sales</CardTitle>
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full dark:bg-indigo-500/10 dark:text-indigo-400">265 this month</span>
                </div>
              </CardHeader>
              <CardContent className="p-0 bg-white dark:bg-zinc-900">
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                  {recentSales.map((sale, index) => (
                    <div key={index} className="flex items-center justify-between p-5 transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                          {sale.initials}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            {sale.name}
                          </p>
                          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                            {sale.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full">
                        {sale.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
