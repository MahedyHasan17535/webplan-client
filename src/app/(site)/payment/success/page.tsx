import { redirect } from "next/navigation"

import { PageContainer } from "@/components/dashboard/page-shell"
import { requireRole } from "@/lib/server"
import { PaymentStatus } from "./payment-status"

export const metadata = { title: "Payment Success" }

export default async function PaymentSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ session_id?: string }>
}) {
    await requireRole("vendor")
    const { session_id: sessionId } = await searchParams
    if (!sessionId) redirect("/dashboard/vendor/subscription")

    return (
        <PageContainer>
            <PaymentStatus sessionId={sessionId} />
        </PageContainer>
    )
}