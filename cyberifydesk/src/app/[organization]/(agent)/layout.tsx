import { checkAgentAuth } from "@/lib/auth-check"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { SidebarMenuLinks } from "@/components/elements/SidebarMenuLinks"

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await checkAgentAuth()

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-0">
          <div className="flex items-center gap-2 px-4 py-4 border-b border-border/40 transition-all duration-200 ease-linear group-data-[collapsible=icon]:px-3 group-data-[collapsible=icon]:gap-0">
            <Image
              src="/logo.png"
              alt="Cyberify Desk Logo"
              width={24}
              height={24}
              className="size-6 object-contain"
            />
            <span className="font-extrabold text-sm tracking-tight text-foreground whitespace-nowrap transition-all duration-200 ease-linear opacity-100 max-w-37.5 group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0 overflow-hidden">
              Cyberify Desk
            </span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuLinks />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-border/40 p-2">
          <div className="flex items-center gap-2 p-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:justify-center overflow-hidden transition-all duration-200 ease-linear">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-xs font-bold text-orange-500">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <span className="text-xs font-bold text-foreground truncate">
                {user.fullName}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                {user.email}
              </span>
            </div>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
