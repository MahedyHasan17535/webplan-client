import { Receipt } from "lucide-react"

import { PageContainer, PageHeader } from "@/components/dashboard/page-shell"
import { EmptyState } from "@/components/shared/empty-state"
import { Pill } from "@/components/shared/pill"
import { getTransactions } from "@/lib/api"
import { formatTimestamp } from "@/lib/format"
import type { TransactionStatus } from "@/lib/types"

export const metadata = { title: "Transactions" }

const STATUS_COLOR: Record<TransactionStatus, string> = {
    paid: "#22C55E",
    failed: "#EF4444",
    refunded: "#F59E0B",
}

export default async function AdminTransactionsPage() {
    const transactions = await getTransactions()

    return (
        <PageContainer width="wide">
            <PageHeader
                overline="Payments"
                title="Transactions"
                subtitle="Subscription payments confirmed by Stripe. These records are read only."
            />

            {transactions.length > 0 ? (
                <div className="surface-card overflow-x-auto">
                    <table className="w-full min-w-[720px] text-left text-sm">
                        <thead className="border-b border-white/10 text-xs text-white/50 uppercase">
                            <tr>
                                <th className="px-5 py-3 font-medium">Vendor</th>
                                <th className="px-5 py-3 font-medium">Plan</th>
                                <th className="px-5 py-3 font-medium">Amount</th>
                                <th className="px-5 py-3 font-medium">Status</th>
                                <th className="px-5 py-3 font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {transactions.map((transaction) => (
                                <tr key={transaction._id}>
                                    <td className="px-5 py-4">
                                        <p className="font-medium text-[#EDEDEF]">
                                            {transaction.vendor?.businessName || transaction.vendor?.name || "Unknown vendor"}
                                        </p>
                                        <p className="text-xs text-white/50">{transaction.vendor?.email}</p>
                                    </td>
                                    <td className="px-5 py-4 text-white/70 capitalize">{transaction.plan}</td>
                                    <td className="px-5 py-4 text-[#EDEDEF]">
                                        {transaction.amount.toFixed(2)} {transaction.currency.toUpperCase()}
                                    </td>
                                    <td className="px-5 py-4">
                                        <Pill
                                            label={transaction.status}
                                            color={STATUS_COLOR[transaction.status]}
                                            dot
                                            className="capitalize"
                                        />
                                    </td>
                                    <td className="px-5 py-4 text-white/70">{formatTimestamp(transaction.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <EmptyState
                    icon={Receipt}
                    title="No transactions yet"
                    description="Payments will appear here once vendors upgrade to Premium."
                />
            )}
        </PageContainer>
    )
}