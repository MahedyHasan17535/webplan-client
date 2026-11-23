// Admin dashboard overview — platform-wide numbers.

import { Briefcase, Clock, Receipt, ShieldCheck, Store, Users } from "lucide-react"

import { PageContainer, PageHeader } from "@/components/dashboard/page-shell"
import { StatCard } from "@/components/shared/stat-card"
import { getAdminStats } from "@/lib/api"

export const metadata = { title: "Admin Overview" }

export default async function AdminOverviewPage() {
    const stats = await getAdminStats()

    return (
        <PageContainer width="wide">
            <PageHeader
                overline="Admin"
                title="Dashboard Overview"
                subtitle="A quick look at users, services and payments across WedPlan."
            />

            <dl className="grid grid-cols-2 gap-6 lg:grid-cols-3">
                <StatCard label="Total Registered Users" value={stats.totalUsers} icon={Users} />
                <StatCard label="Total Vendors" value={stats.totalVendors} icon={Store} />
                <StatCard label="Total Customers" value={stats.totalCustomers} icon={ShieldCheck} />
                <StatCard label="Total Services" value={stats.totalServices} icon={Briefcase} />
                <StatCard
                    label="Pending Services"
                    value={stats.pendingServices}
                    note="Waiting for review"
                    icon={Clock}
                />
                <StatCard label="Total Transactions" value={stats.totalTransactions} icon={Receipt} />
            </dl>
        </PageContainer>
    )
}