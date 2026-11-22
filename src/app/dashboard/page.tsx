import { redirect } from "next/navigation"
import { requireSession } from "@/lib/server"

// /dashboard sends every user to the dashboard of their own role.
export default async function DashboardIndexPage() {
    const session = await requireSession("/dashboard")
    redirect(`/dashboard/${session.user.role}`)
}