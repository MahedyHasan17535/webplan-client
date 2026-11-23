import Link from "next/link"
import { CalendarCheck, Clock, Crown, Package, Sparkles } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { PageContainer, PageHeader } from "@/components/dashboard/page-shell"
import { StatCard } from "@/components/shared/stat-card"
import { getVendorStats } from "@/lib/api"
import { requireSession } from "@/lib/server"
import { cn } from "@/lib/utils"

export const metadata = { title: "Vendor Overview" }

export default async function VendorOverviewPage() {
    const session = await requireSession()
    const stats = await getVendorStats()
    const isPremium = stats.subscriptionPlan === "premium"

    return (
        <PageContainer width="wide">
            <PageHeader
                overline="Vendor"
                title="Dashboard Overview"
                subtitle={`Welcome back, ${session.user.name}. Here is how your business is doing.`}
                action={
                    <Link
                        href="/dashboard/vendor/services/new"
                        className={cn(buttonVariants(), "btn-brand text-white")}
                    >
                        Add Service
                    </Link>
                }
            />

            <dl className="grid grid-cols-2 gap-6 lg:grid-cols-3">
                <StatCard label="Total Services" value={stats.totalServices} icon={Package} />
                <StatCard
                    label="Active Services"
                    value={stats.activeServices}
                    note="Approved and visible to customers"
                    icon={Sparkles}
                />
                <StatCard
                    label="Pending Booking Requests"
                    value={stats.pendingBookings}
                    icon={Clock}
                />
                <StatCard
                    label="Accepted Bookings"
                    value={stats.acceptedBookings}
                    icon={CalendarCheck}
                />
                <StatCard
                    label="Current Plan"
                    value={isPremium ? "Premium" : "Free"}
                    note={isPremium ? "Unlimited services" : "Up to 3 active services"}
                    icon={Crown}
                    className={isPremium ? "border-[#D8B26E]/40" : undefined}
                />
            </dl>

            {isPremium ? null : (
                <div className="surface-card mt-8 flex flex-wrap items-center justify-between gap-4 p-6">
                    <div>
                        <h2 className="font-heading text-lg font-semibold text-white">
                            Need to publish more than 3 services?
                        </h2>
                        <p className="text-sm text-white/60">
                            Upgrade to Premium for unlimited services and the Premium Vendor badge.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/vendor/subscription"
                        className={cn(buttonVariants({ variant: "outline" }))}
                    >
                        View plans
                    </Link>
                </div>
            )}
        </PageContainer>
    )
}