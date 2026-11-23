"use client"

import * as React from "react"
import { Crown, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { createCheckoutSession } from "@/lib/api"

export function UpgradeButton() {
    const [pending, setPending] = React.useState(false)

    const handleUpgrade = async () => {
        setPending(true)
        const result = await createCheckoutSession()

        if (!result.ok || !result.url) {
            setPending(false)
            toast.add({
                type: "error",
                title: "Could not start checkout",
                description: result.message ?? "Please try again in a moment.",
            })
            return
        }
        // Keep the spinner while the browser leaves for Stripe.
        window.location.assign(result.url)
    }

    return (
        <Button
            onClick={handleUpgrade}
            disabled={pending}
            className="btn-brand h-11 w-full gap-2 text-white"
        >
            {pending ? <Loader2 aria-hidden className="animate-spin" /> : <Crown aria-hidden />}
            {pending ? "Redirecting to Stripe…" : "Upgrade to Premium"}
        </Button>
    )
}