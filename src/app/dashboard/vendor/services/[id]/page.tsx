import { notFound } from "next/navigation"

import { PageContainer, PageHeader } from "@/components/dashboard/page-shell"
import { getServiceById } from "@/lib/api"
import { requireSession } from "@/lib/server"
import { ServiceForm } from "../../_components/service-form"

export const metadata = { title: "Edit Service" }

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await requireSession()

    const service = await getServiceById(id)
    // A vendor can only edit their own services (the API checks this again).
    if (!service || service.vendorId !== session.user.id) notFound()

    return (
        <PageContainer>
            <PageHeader
                overline="Services"
                title="Edit Service"
                subtitle="A rejected service goes back to review after you save changes."
            />
            <ServiceForm service={service} />
        </PageContainer>
    )
}