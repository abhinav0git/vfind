"use client"

import * as React from "react"
import { Shirt, Image as ImageIcon, LogOut, Home, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
    activeTab: "vton" | "search" | "more"
    onTabChange: (tab: "vton" | "search" | "more") => void
    onLogout: () => void
    userEmail?: string | null
}

export function DashboardSidebar({
    activeTab,
    onTabChange,
    onLogout,
    userEmail,
    ...props
}: DashboardSidebarProps) {
    const router = useRouter()

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <div className="h-4 w-4 bg-white rounded-full" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">VFind</span>
                                <span className="truncate text-xs">AI Fashion Search</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Tools</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={activeTab === "vton"}
                                    onClick={() => onTabChange("vton")}
                                    tooltip="Virtual Try-On"
                                    className="data-[active=true]:bg-zinc-200 data-[active=true]:text-black"
                                >
                                    <Shirt className="h-4 w-4" />
                                    <span>Virtual Try-On</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={activeTab === "search"}
                                    onClick={() => onTabChange("search")}
                                    tooltip="Image Search"
                                    className="data-[active=true]:bg-zinc-200 data-[active=true]:text-black"
                                >
                                    <ImageIcon className="h-4 w-4" />
                                    <span>Image Search</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={activeTab === "more"}
                                    onClick={() => onTabChange("more")}
                                    tooltip="More"
                                    className="data-[active=true]:bg-zinc-200 data-[active=true]:text-black"
                                >
                                    <Sparkles className="h-4 w-4" />
                                    <span>More</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => router.push("/")}
                            tooltip="Home"
                        >
                            <Home className="h-4 w-4" />
                            <span>Home</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={onLogout}
                            tooltip="Logout"
                            className="text-destructive hover:text-destructive"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
