"use client"

import * as React from "react"
import Link from "next/link"
import { CheckCircle2, Clock, Loader2 } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { getPaymentStatus } from "@/lib/api"
import { cn } from "@/lib/utils"

const MAX_ATTEMPTS = 10
const POLL_MS = 2000

export function PaymentStatus({ sessionId }: { sessionId: string }) {
    const [state, setState] = React.useState<"checking" | "paid" | "delayed">("checking")
    const [amount, setAmount] = React.useState<string | null>(null)

    React.useEffect(() => {
        let cancelled = false

        async function poll(attempt: number) {
            const result = await getPaymentStatus(sessionId)
            if (cancelled) return

            if (result.status === "paid") {
                if (result.amount !== undefined && result.currency) {
                    setAmount(`${result.amount.toFixed(2)} ${result.currency.toUpperCase()}`)
                }
                setState("paid")
                return
            }
            if (attempt >= MAX_ATTEMPTS) {
                setState("delayed")
                return
            }
            setTimeout(() => poll(attempt + 1), POLL_MS)
        }

        poll(1)
        return () => {
            cancelled = true
        }
    }, [sessionId])

    return (
        <div className="surface-card flex flex-col items-center gap-4 p-10 text-center">
            {state === "checking" ? (
                <>
                    <Loader2 aria-hidden className="size-12 animate-spin text-brand-soft" />
                    <h1 className="page-title">Confirming your payment…</h1>
                    <p className="max-w-md text-sm text-white/60">
                        Stripe is confirming the payment with our server. This usually takes a few seconds.
                    </p>
                </>
            ) : null}

            {state === "paid" ? (
                <>
                    <CheckCircle2 aria-hidden className="size-12 text-[#22C55E]" />
                    <h1 className="page-title">Payment successful</h1>
                    <p className="max-w-md text-sm text-white/60">
                        Thank you! Your Premium plan is active{amount ? ` (${amount})` : ""}. You can now publish
                        unlimited services.
                    </p>
                </>
            ) : null}

            {state === "delayed" ? (
                <>
                    <Clock aria-hidden className="size-12 text-[#F59E0B]" />
                    <h1 className="page-title">Payment received, activating…</h1>
                    <p className="max-w-md text-sm text-white/60">
                        Your payment is being verified. Premium turns on as soon as it is confirmed, check the
                        subscription page in a minute.
                    </p>
                </>
            ) : null}

            <Link
                href="/dashboard/vendor/subscription"
                className={cn(buttonVariants(), "btn-brand mt-2 text-white")}
            >
                Go to subscription
            </Link>
        </div>
    )
}