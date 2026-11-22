import Link from "next/link"
import { SearchX } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { ServiceCard } from "@/components/shared/service-card"
import { Skeleton } from "@/components/ui/skeleton"
import { getServices } from "@/lib/api"
import { cn } from "@/lib/utils"

export function ServiceGridSkeleton() {
    return (
        <ul aria-label="Loading services" className="grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
                <li key={index} className="surface-card overflow-hidden">
                    <Skeleton className="aspect-[4/3] w-full rounded-none" />
                    <div className="flex flex-col gap-3 p-5">
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="mt-4 h-9 w-full" />
                    </div>
                </li>
            ))}
        </ul>
    )
}

export async function ServiceResults({ query }: { query: string }) {
    const services = await getServices(query)

    if (services.length === 0) {
        return (
            <EmptyState
                icon={SearchX}
                title="No services found"
                description="Try a different keyword, category or location, or clear the filters to see everything."
                action={
                    <Link href="/services" className={cn(buttonVariants({ variant: "outline" }), "mt-2")}>
                        Clear filters
                    </Link>
                }
            />
        )
    }

    return (
        <>
            <h2 className="mb-4 text-sm text-white/60">
                Showing {services.length} {services.length === 1 ? "service" : "services"}
            </h2>
            <ul className="grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                    <ServiceCard key={service._id} service={service} />
                ))}
            </ul>
        </>
    )
}