import { Suspense } from "react"

import { PageContainer, PageHeader } from "@/components/dashboard/page-shell"
import { ServiceFilters } from "./_components/service-filters"
import { ServiceGridSkeleton, ServiceResults } from "./_components/service-results"

export const metadata = { title: "Browse Services" }

const FILTER_KEYS = ["search", "category", "location", "sort"] as const

export default async function BrowseServicesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const search = await searchParams

    // Only forward the known filters, as plain strings.
    const urlSearch = new URLSearchParams()
    for (const key of FILTER_KEYS) {
        const value = search[key]
        if (typeof value === "string" && value) urlSearch.set(key, value)
    }
    const query = urlSearch.toString()

    return (
        <PageContainer width="wide">
            <PageHeader
                overline="Browse"
                title="Wedding Services"
                subtitle="Search, filter and compare services from trusted wedding vendors."
            />

            <Suspense>
                <ServiceFilters />
            </Suspense>

            <div className="mt-8">
                <Suspense key={query} fallback={<ServiceGridSkeleton />}>
                    <ServiceResults query={query} />
                </Suspense>
            </div>
        </PageContainer>
    )
}