// Customer dashboard overview — booking request counts.

import Link from "next/link"
import { CalendarCheck, CalendarX, Clock, ListChecks } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { PageContainer, PageHeader } from "@/components/dashboard/page-shell"
import { StatCard } from "@/components/shared/stat-card"
import { getCustomerStats } from "@/lib/api"
import { requireSession } from "@/lib/server"
import { cn } from "@/lib/utils"

export const metadata = { title: "Customer Overview" }

export default async function CustomerOverviewPage() {
    const session = await requireSession()
    const stats = await getCustomerStats()

    return (
        <PageContainer width="wide">
            <PageHeader
                overline="Customer"
                title="Dashboard Overview"
                subtitle={`Welcome back, ${session.user.name}. Here is where your requests stand.`}
                action={
                    <Link href="/services" className={cn(buttonVariants(), "btn-brand text-white")}>
                        Browse services
                    </Link>
                }
            />

            <dl className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                <StatCard label="Total Booking Requests" value={stats.total} icon={ListChecks} />
                <StatCard label="Pending Bookings" value={stats.pending} icon={Clock} />
                <StatCard label="Accepted Bookings" value={stats.accepted} icon={CalendarCheck} />
                <StatCard label="Rejected Bookings" value={stats.rejected} icon={CalendarX} />
            </dl>
        </PageContainer>
    )
}