"use client"

import * as React from "react"
import {
  Users,
  Building2,
  Receipt,
  Calendar,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Funcionários",
      url: "/funcionarios",
      icon: Users,
      isActive: true,
    },
    {
      title: "Filiais",
      url: "/filiais",
      icon: Building2,
    },
    {
      title: "Folha de Pagamento",
      url: "/folha-pagamento",
      icon: Receipt,
    },
    // {
    //   title: "Férias",
    //   url: "/ferias",
    //   icon: Calendar,
    // },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex h-14 items-center px-4">
          <span className="text-lg font-semibold">RH System</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
