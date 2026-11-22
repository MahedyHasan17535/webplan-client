import Link from "next/link"
import { ShieldAlert } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { cn } from "@/lib/utils"

export const metadata = { title: "Unauthorized" }

export default function UnauthorizedPage() {
    return (
        <div className="mx-auto flex min-h-svh w-full max-w-xl items-center px-4">
            <EmptyState
                icon={ShieldAlert}
                title="You don't have access to this page"
                description="This area belongs to another role, or your account has been blocked. If you think this is a mistake, please contact support."
                action={
                    <div className="mt-2 flex gap-3">
                        <Link href="/" className={cn(buttonVariants(), "btn-brand text-white")}>
                            Go home
                        </Link>
                        <Link href="/sign-in" className={cn(buttonVariants({ variant: "outline" }))}>
                            Sign in
                        </Link>
                    </div>
                }
            />
        </div>
    )
}