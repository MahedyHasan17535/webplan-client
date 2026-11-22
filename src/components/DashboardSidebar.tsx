"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { signOut, useSession } from "@/lib/auth-client"
import { ROLE_META } from "@/lib/types"
import type { UserRole } from "@/lib/types"
import { UserAvatar } from "@/components/shared/user-avatar"
import { WedPlanLogo } from "@/components/site-navbar"
import {
    CalendarCheck,
    CalendarHeart,
    Crown,
    Home,
    LayoutDashboard,
    LogOut,
    Package,
    PlusCircle,
    Receipt,
    Settings,
    ShieldCheck,
    Users,
    type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

type MenuItem = {
    id: string
    name: string
    url: string
    icon: LucideIcon
}

// The Home link sits above the role menu and is shared by every role.
const homeItem: MenuItem = { id: "home", name: "Home", url: "/", icon: Home }

// Sidebar navigation is decided by the signed-in user's role. The server
// layouts (`requireRole`) and the API enforce access, hiding links is only UX.
const menuItemsByRole: Record<UserRole, MenuItem[]> = {
    vendor: [
        { id: "overview", name: "Overview", url: "/dashboard/vendor", icon: LayoutDashboard },
        { id: "services", name: "My Services", url: "/dashboard/vendor/services", icon: Package },
        { id: "add-service", name: "Add Service", url: "/dashboard/vendor/services/new", icon: PlusCircle },
        { id: "bookings", name: "Booking Requests", url: "/dashboard/vendor/bookings", icon: CalendarCheck },
        { id: "subscription", name: "Subscription", url: "/dashboard/vendor/subscription", icon: Crown },
        { id: "settings", name: "Profile Settings", url: "/dashboard/vendor/settings", icon: Settings },
    ],
    customer: [
        { id: "overview", name: "Overview", url: "/dashboard/customer", icon: LayoutDashboard },
        { id: "bookings", name: "My Bookings", url: "/dashboard/customer/bookings", icon: CalendarHeart },
        { id: "settings", name: "Profile Settings", url: "/dashboard/customer/settings", icon: Settings },
    ],
    admin: [
        { id: "overview", name: "Overview", url: "/dashboard/admin", icon: LayoutDashboard },
        { id: "users", name: "Manage Users", url: "/dashboard/admin/users", icon: Users },
        { id: "services", name: "Manage Services", url: "/dashboard/admin/services", icon: ShieldCheck },
        { id: "transactions", name: "Transactions", url: "/dashboard/admin/transactions", icon: Receipt },
        { id: "settings", name: "Profile Settings", url: "/dashboard/admin/settings", icon: Settings },
    ],
}


export function DashboardSidebar() {
    const router = useRouter()
    const pathname = usePathname()
    const { data: session, isPending } = useSession();
    const role: UserRole = session?.user?.role || 'customer';

    // The overview link only matches exactly, other links match their sub pages.
    const isActive = (item: MenuItem) =>
        item.id === "overview"
            ? pathname === item.url
            : pathname === item.url || pathname.startsWith(item.url + "/")

    const handleLogout = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/")
                    router.refresh()
                },
            },
        })
    }

    return (
        <Sidebar>
            <SidebarHeader>
                <WedPlanLogo className="px-2 pt-1 text-xl" />
                {/* Signed-in user: avatar + name + role */}
                <div className="flex items-center gap-2.5 px-2 py-1.5">
                    <UserAvatar
                        src={session?.user?.image}
                        name={session?.user?.name}
                        className="size-9"
                    />
                    <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-medium text-[#EDEDEF]">
                            {isPending ? "…" : session?.user?.name}
                        </span>
                        <span className="truncate text-xs text-[#6E6E78]">
                            {ROLE_META[role].label}
                        </span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {/* Shared across all roles: back to the public site */}
                        <SidebarMenuItem key={homeItem.id}>
                            <SidebarMenuButton render={<Link href={homeItem.url} />}>
                                <homeItem.icon />
                                <span>{homeItem.name}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarMenu>
                        {menuItemsByRole[role].map((item) => (
                            <SidebarMenuItem key={item.id}>
                                <SidebarMenuButton
                                    isActive={isActive(item)}
                                    render={<Link href={item.url} />}
                                >
                                    <item.icon />
                                    <span>{item.name}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout}>
                            <LogOut />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}