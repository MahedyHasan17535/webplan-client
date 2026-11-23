import { Check, Crown } from "lucide-react"

import { PageContainer, PageHeader } from "@/components/dashboard/page-shell"
import { Pill } from "@/components/shared/pill"
import { getCurrentUser } from "@/lib/api"
import { getMyTransactions } from "@/lib/api"
import { formatTimestamp } from "@/lib/format"
import { cn } from "@/lib/utils"
import { UpgradeButton } from "./_components/upgrade-button"

export const metadata = { title: "Subscription" }

const FREE_FEATURES = ["Maximum 3 active services", "Basic vendor dashboard", "Booking request management"]
const PREMIUM_FEATURES = ["Unlimited active services", "Premium Vendor badge", "All Free plan features"]

function PlanCard({
    name,
    price,
    features,
    current,
    highlight,
    action,
}: {
    name: string
    price: string
    features: string[]
    current: boolean
    highlight?: boolean
    action?: React.ReactNode
}) {
    return (
        <section className={cn("surface-card flex flex-col gap-5 p-6", highlight && "border-[#D8B26E]/40")}>
            <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 font-heading text-xl font-semibold text-white">
                    {highlight ? <Crown aria-hidden className="size-5 text-gold" /> : null}
                    {name}
                </h2>
                {current ? <Pill label="Current plan" color="#22C55E" dot /> : null}
            </div>
            <p className="text-3xl font-bold text-white">{price}</p>
            <ul className="flex flex-1 list-none flex-col gap-2.5 text-sm text-white/70">
                {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5">
                        <Check aria-hidden className="size-4 shrink-0 text-brand-soft" />
                        {feature}
                    </li>
                ))}
            </ul>
            {action}
        </section>
    )
}

export default async function VendorSubscriptionPage() {
    const [user, transactions] = await Promise.all([getCurrentUser(), getMyTransactions()])
    const isPremium = user.subscriptionPlan === "premium"

    return (
        <PageContainer width="wide">
            <PageHeader
                overline="Subscription"
                title="Plans"
                subtitle={
                    isPremium && user.subscriptionExpiresAt
                        ? `Premium is active until ${formatTimestamp(user.subscriptionExpiresAt)}.`
                        : "Upgrade to publish more than 3 active services."
                }
            />

            <div className="grid gap-6 md:grid-cols-2">
                <PlanCard name="Free" price="$0" features={FREE_FEATURES} current={!isPremium} />
                <PlanCard
                    name="Premium"
                    price="$29 / month"
                    features={PREMIUM_FEATURES}
                    current={isPremium}
                    highlight
                    action={
                        isPremium ? null : (
                            <div className="flex flex-col gap-2">
                                <UpgradeButton />
                                <p className="text-center text-xs text-white/40">
                                    Secure checkout by Stripe. Premium activates once the payment is confirmed.
                                </p>
                            </div>
                        )
                    }
                />
            </div>

            {transactions.length > 0 ? (
                <section className="mt-10">
                    <h2 className="mb-4 font-heading text-lg font-semibold text-white">Payment history</h2>
                    <div className="surface-card overflow-x-auto">
                        <table className="w-full min-w-[480px] text-left text-sm">
                            <thead className="border-b border-white/10 text-xs text-white/50 uppercase">
                                <tr>
                                    <th className="px-5 py-3 font-medium">Date</th>
                                    <th className="px-5 py-3 font-medium">Plan</th>
                                    <th className="px-5 py-3 font-medium">Amount</th>
                                    <th className="px-5 py-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {transactions.map((transaction) => (
                                    <tr key={transaction._id}>
                                        <td className="px-5 py-3 text-[#EDEDEF]">{formatTimestamp(transaction.createdAt)}</td>
                                        <td className="px-5 py-3 text-white/70 capitalize">{transaction.plan}</td>
                                        <td className="px-5 py-3 text-[#EDEDEF]">
                                            {transaction.amount.toFixed(2)} {transaction.currency.toUpperCase()}
                                        </td>
                                        <td className="px-5 py-3 text-white/70 capitalize">{transaction.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            ) : null}
        </PageContainer>
    )
}