import Link from "next/link"
import { Compass } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { cn } from "@/lib/utils"

// Invalid routes land here instead of a blank 404.
export default function NotFound() {
    return (
        <div className="mx-auto flex min-h-svh w-full max-w-xl items-center px-4">
            <EmptyState
                icon={Compass}
                title="Page not found"
                description="The page you are looking for does not exist or has moved."
                action={
                    <div className="mt-2 flex gap-3">
                        <Link href="/" className={cn(buttonVariants(), "btn-brand text-white")}>
                            Go home
                        </Link>
                        <Link href="/services" className={cn(buttonVariants({ variant: "outline" }))}>
                            Browse services
                        </Link>
                    </div>
                }
            />
        </div>
    )
}