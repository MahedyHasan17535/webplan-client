import { PageContainer, PageHeader } from "@/components/dashboard/page-shell"
import { ServiceForm } from "../_components/service-form"

export const metadata = { title: "Add Service" }

export default function NewServicePage() {
    return (
        <PageContainer>
            <PageHeader
                overline="Services"
                title="Add New Service"
                subtitle="New services start as Pending and go live after an admin approves them."
            />
            <ServiceForm />
        </PageContainer>
    )
}