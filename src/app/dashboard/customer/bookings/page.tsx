import Link from "next/link"
import { CalendarHeart } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { PageContainer, PageHeader } from "@/components/dashboard/page-shell"
import { EmptyState } from "@/components/shared/empty-state"
import { getMyBookings } from "@/lib/api"
import { cn } from "@/lib/utils"
import { CustomerBookingsTable } from "./_components/customer-bookings-table"

export const metadata = { title: "My Bookings" }

export default async function CustomerBookingsPage() {
    const bookings = await getMyBookings()

    return (
        <PageContainer width="wide">
            <PageHeader
                overline="Bookings"
                title="My Bookings"
                subtitle="Track every booking request you have sent to vendors."
            />

            {bookings.length > 0 ? (
                <CustomerBookingsTable bookings={bookings} />
            ) : (
                <EmptyState
                    icon={CalendarHeart}
                    title="No booking requests yet"
                    description="Find a service you love and send your first request."
                    action={
                        <Link href="/services" className={cn(buttonVariants(), "btn-brand mt-2 text-white")}>
                            Browse services
                        </Link>
                    }
                />
            )}
        </PageContainer>
    )
}