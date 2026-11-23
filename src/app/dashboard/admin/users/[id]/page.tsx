import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { PageContainer } from "@/components/dashboard/page-shell"
import { Pill } from "@/components/shared/pill"
import { RolePill } from "@/components/shared/role-pill"
import { UserAvatar } from "@/components/shared/user-avatar"
import { getUserById } from "@/lib/api"
import { formatTimestamp } from "@/lib/format"
import { cn } from "@/lib/utils"
import { BlockUserButton } from "../_components/block-user-button"

export const metadata = { title: "User Details" }

export default async function AdminUserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const user = await getUserById(id)
    if (!user) notFound()

    const rows: [string, React.ReactNode][] = [
        ["Email", user.email],
        ["Joined", formatTimestamp(user.createdAt)],
        ["Subscription plan", <span key="plan" className="capitalize">{user.subscriptionPlan}</span>],
        [
            "Plan expires",
            user.subscriptionExpiresAt ? formatTimestamp(user.subscriptionExpiresAt) : "—",
        ],
    ]
    if (user.role === "vendor") rows.splice(1, 0, ["Business name", user.businessName || "—"])

    return (
        <PageContainer>
            <Link
                href="/dashboard/admin/users"
                className={cn(buttonVariants({ variant: "ghost" }), "mb-4 gap-2 px-2")}
            >
                <ArrowLeft aria-hidden /> Back to users
            </Link>

            <section className="surface-card flex flex-col gap-6 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <UserAvatar src={user.image} name={user.name} className="size-16" />
                        <div className="flex flex-col gap-1.5">
                            <h1 className="page-title">{user.name}</h1>
                            <div className="flex items-center gap-2">
                                <RolePill role={user.role} />
                                <Pill
                                    label={user.isBlocked ? "Blocked" : "Active"}
                                    color={user.isBlocked ? "#EF4444" : "#22C55E"}
                                    dot
                                />
                            </div>
                        </div>
                    </div>
                    <BlockUserButton user={user} />
                </div>

                <dl className="grid gap-5 sm:grid-cols-2">
                    {rows.map(([label, value]) => (
                        <div key={label}>
                            <dt className="text-xs text-white/50 uppercase">{label}</dt>
                            <dd className="mt-1 break-all text-[#EDEDEF]">{value}</dd>
                        </div>
                    ))}
                </dl>
            </section>
        </PageContainer>
    )
}