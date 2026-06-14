import { checkAgentAuth } from "@/lib/auth-check"
import { DashboardHeader } from "@/app/[organization]/(agent)/_components/DashboardHeader"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  IconTicket,
  IconClock,
  IconCircleCheck,
  IconAlertCircle,
} from "@tabler/icons-react"
import fetchStats from "./_lib/fetch_stats"

import { BackgroundBlur } from "@/components/elements/BackgroundBlur"
import Footer from "../_components/Footer"

export type Props = {
  params: Promise<{ organization: string }>
}

export default async function Page({params}: Props) {
  const user = await checkAgentAuth()
  const { organization } = await params

  const stats = await fetchStats(organization)
  return (
    <div className="relative flex min-h-screen flex-col bg-background font-sans text-foreground transition-colors duration-300 selection:bg-primary/30">
      <BackgroundBlur />

      <DashboardHeader title="Dashboard" user={user} />

      <main className="px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          <Card className="[--card-spacing:--spacing(4)] sm:[--card-spacing:--spacing(6)] border border-border/40 bg-card/30 backdrop-blur-md hover:border-border transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
                Total Tickets
              </CardTitle>
              <div className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                <IconTicket className="size-3.5 sm:size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.length}</p>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-1 truncate">
                All tickets ever created
              </p>
            </CardContent>
          </Card>

          <Card className="[--card-spacing:--spacing(4)] sm:[--card-spacing:--spacing(6)] border border-border/40 bg-card/30 backdrop-blur-md hover:border-border transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
                Open Tickets
              </CardTitle>
              <div className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                <IconClock className="size-3.5 sm:size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.filter((t: any) => t.status === "open").length}</p>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-1 truncate">
                All Open tickets
              </p>
            </CardContent>
          </Card>

          <Card className="[--card-spacing:--spacing(4)] sm:[--card-spacing:--spacing(6)] border border-border/40 bg-card/30 backdrop-blur-md hover:border-border transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
                Closed Tickets
              </CardTitle>
              <div className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <IconCircleCheck className="size-3.5 sm:size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.filter((t: any) => t.status === "close").length}</p>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-1 truncate">
                Agent issues resolved
              </p>
            </CardContent>
          </Card>

          <Card className="[--card-spacing:--spacing(4)] sm:[--card-spacing:--spacing(6)] border border-border/40 bg-card/30 backdrop-blur-md hover:border-border transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
                Pending Tickets
              </CardTitle>
              <div className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                <IconAlertCircle className="size-3.5 sm:size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.filter((t: any) => t.status === "pending").length}</p>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-1 truncate">
                Still needs attention
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
