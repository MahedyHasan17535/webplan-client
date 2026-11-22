import { Loader2 } from "lucide-react"

export default function Loading() {
    return (
        <div
            role="status"
            aria-label="Loading"
            className="flex min-h-[60vh] items-center justify-center"
        >
            <Loader2 aria-hidden className="size-10 animate-spin text-brand-soft" />
        </div>
    )
}