import { PageContainer, PageHeader } from "@/components/dashboard/page-shell"
import { ProfileForm } from "@/components/shared/profile-form"
import { getCurrentUser } from "@/lib/api"

export const metadata = { title: "Profile Settings" }

export default async function ProfileSettingsPage() {
    const user = await getCurrentUser()

    return (
        <PageContainer>
            <PageHeader
                overline="Account"
                title="Profile Settings"
                subtitle="Update your name and photo. Your role and plan can't be changed here."
            />
            <ProfileForm user={user} />
        </PageContainer>
    )
}