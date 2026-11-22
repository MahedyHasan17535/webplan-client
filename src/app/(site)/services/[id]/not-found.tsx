import Link from "next/link"
import { SearchX } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { PageContainer } from "@/components/dashboard/page-shell"
import { EmptyState } from "@/components/shared/empty-state"
import { cn } from "@/lib/utils"


export default function ServiceNotFound() {
    return (
        <PageContainer>
            <EmptyState
                icon={SearchX}
                title="Service not found"
                description="This link is invalid, or the service has been removed or is not available any more."
                action={
                    <Link href="/services" className={cn(buttonVariants(), "btn-brand mt-2 text-white")}>
                        Browse services
                    </Link>
                }
            />
        </PageContainer>
    )
}