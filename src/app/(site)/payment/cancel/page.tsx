import Link from "next/link"
import { XCircle } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { PageContainer } from "@/components/dashboard/page-shell"
import { requireRole } from "@/lib/server"
import { cn } from "@/lib/utils"

export const metadata = { title: "Payment Cancelled" }

export default async function PaymentCancelPage() {
    await requireRole("vendor")

    return (
        <PageContainer>
            <div className="surface-card flex flex-col items-center gap-4 p-10 text-center">
                <XCircle aria-hidden className="size-12 text-[#F87171]" />
                <h1 className="page-title">Payment cancelled</h1>
                <p className="max-w-md text-sm text-white/60">
                    No charge was made and your plan has not changed. You can upgrade whenever you are ready.
                </p>
                <Link
                    href="/dashboard/vendor/subscription"
                    className={cn(buttonVariants(), "btn-brand mt-2 text-white")}
                >
                    Back to plans
                </Link>
            </div>
        </PageContainer>
    )
}