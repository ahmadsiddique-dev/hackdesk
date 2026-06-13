"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import {
  IconLayoutDashboard,
  IconTicket,
  IconUsers,
  IconBook,
  IconSettings,
} from "@tabler/icons-react"

export function SidebarMenuLinks() {
  const pathname = usePathname()
  const params = useParams()
  const organization = (params?.organization as string) || "default"

  const links = [
    {
      href: "/dashboard",
      label: "Dashboard",
      tooltip: "Dashboard",
      icon: IconLayoutDashboard,
    },
    {
      href: "/tickets",
      label: "Tickets Queue",
      tooltip: "Tickets Queue",
      icon: IconTicket,
    },
    {
      href: "/customers",
      label: "Customers",
      tooltip: "Customers",
      icon: IconUsers,
    },
    {
      href: "/knowledge-base",
      label: "Knowledge Base",
      tooltip: "Knowledge Base",
      icon: IconBook,
    },
    {
      href: "/settings",
      label: "Settings",
      tooltip: "Settings",
      icon: IconSettings,
    },
  ]

  return (
    <>
      {links.map((link) => {
        const Icon = link.icon
        const linkHref = `/${organization}${link.href}`
        const isActive = pathname === linkHref

        return (
          <SidebarMenuItem key={linkHref}>
            <SidebarMenuButton tooltip={link.tooltip} isActive={isActive} asChild>
              <Link href={linkHref}>
                <Icon className="size-5! transition-all duration-200 ease-linear group-data-[collapsible=icon]:size-4!" />
                <span className="whitespace-nowrap text-xs transition-all duration-200 ease-linear opacity-100 max-w-37.5 group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0 overflow-hidden">
                  {link.label}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </>
  )
}
