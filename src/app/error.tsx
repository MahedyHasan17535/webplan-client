"use client"

import { TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"

// Catches unexpected errors (for example a failed API request) in any page.
export default function GlobalError({
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="mx-auto flex min-h-svh w-full max-w-xl items-center px-4">
            <EmptyState
                icon={TriangleAlert}
                title="Something went wrong"
                description="We could not load this page. Check your connection and try again."
                action={
                    <Button onClick={reset} className="btn-brand mt-2 text-white">
                        Try again
                    </Button>
                }
            />
        </div>
    )
}