import { Suspense } from "react"
import { ShieldCheck } from "lucide-react"

import { PageContainer, PageHeader } from "@/components/dashboard/page-shell"
import { EmptyState } from "@/components/shared/empty-state"
import { UrlFilters } from "@/components/shared/url-filters"
import { getAdminServices } from "@/lib/api"
import { SERVICE_CATEGORIES, SERVICE_STATUS_META, SERVICE_STATUSES } from "@/lib/types"
import { AdminServicesTable } from "./_components/admin-services-table"

export const metadata = { title: "Manage Services" }

export default async function AdminServicesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const search = await searchParams
    const urlSearch = new URLSearchParams()
    for (const key of ["search", "status", "category"]) {
        const value = search[key]
        if (typeof value === "string" && value) urlSearch.set(key, value)
    }

    const services = await getAdminServices(urlSearch.toString())

    return (
        <PageContainer width="wide">
            <PageHeader
                overline="Admin"
                title="Manage Services"
                subtitle="Review pending services, approve or reject them, and remove inappropriate ones."
            />

            <Suspense>
                <UrlFilters
                    searchPlaceholder="Search by service name"
                    selects={[
                        {
                            name: "status",
                            label: "All statuses",
                            options: SERVICE_STATUSES.map((status) => ({
                                value: status,
                                label: SERVICE_STATUS_META[status].label,
                            })),
                        },
                        {
                            name: "category",
                            label: "All categories",
                            options: SERVICE_CATEGORIES.map((category) => ({ value: category, label: category })),
                        },
                    ]}
                />
            </Suspense>

            {services.length > 0 ? (
                <AdminServicesTable services={services} />
            ) : (
                <EmptyState
                    icon={ShieldCheck}
                    title="No services match"
                    description="Try a different name, status or category."
                />
            )}
        </PageContainer>
    )
}