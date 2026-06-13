import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AgentHeaderMenu } from "@/app/[organization]/(agent)/_components/AgentHeaderMenu"

export function DashboardHeader({
  title,
  user,
}: {
  title: string
  user: { fullName: string; role: string }
}) {
  return (
    <header className="border-b border-border/40 bg-card/25 backdrop-blur-md sticky top-0 z-50">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </span>
        </div>
        <AgentHeaderMenu fullName={user.fullName} role={user.role} />
      </div>
    </header>
  )
}
