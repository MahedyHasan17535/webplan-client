import Link from "next/link"
import { Package } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { PageContainer, PageHeader } from "@/components/dashboard/page-shell"
import { EmptyState } from "@/components/shared/empty-state"
import { getMyServices } from "@/lib/api"
import { cn } from "@/lib/utils"
import { VendorServicesTable } from "./_components/vendor-services-table"

export const metadata = { title: "My Services" }

export default async function VendorServicesPage() {
    const services = await getMyServices()

    return (
        <PageContainer width="wide">
            <PageHeader
                overline="Services"
                title="My Services"
                subtitle="Manage your listings, approval status and availability."
                action={
                    <Link
                        href="/dashboard/vendor/services/new"
                        className={cn(buttonVariants(), "btn-brand text-white")}
                    >
                        Add Service
                    </Link>
                }
            />

            {services.length > 0 ? (
                <VendorServicesTable services={services} />
            ) : (
                <EmptyState
                    icon={Package}
                    title="You have no services yet"
                    description="Add your first service. It goes live after an admin approves it."
                    action={
                        <Link
                            href="/dashboard/vendor/services/new"
                            className={cn(buttonVariants(), "btn-brand mt-2 text-white")}
                        >
                            Add your first service
                        </Link>
                    }
                />
            )}
        </PageContainer>
    )
}