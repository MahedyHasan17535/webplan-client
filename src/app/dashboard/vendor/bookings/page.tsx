import { CalendarCheck } from "lucide-react"

import { PageContainer, PageHeader } from "@/components/dashboard/page-shell"
import { EmptyState } from "@/components/shared/empty-state"
import { getVendorBookings } from "@/lib/api"
import { BookingRequestsTable } from "./_components/booking-requests-table"

export const metadata = { title: "Booking Requests" }

export default async function VendorBookingsPage() {
    const bookings = await getVendorBookings()

    return (
        <PageContainer width="wide">
            <PageHeader
                overline="Bookings"
                title="Booking Requests"
                subtitle="Review requests from customers and accept or reject pending ones."
            />

            {bookings.length > 0 ? (
                <BookingRequestsTable bookings={bookings} />
            ) : (
                <EmptyState
                    icon={CalendarCheck}
                    title="No booking requests yet"
                    description="When a customer requests one of your services it will show up here."
                />
            )}
        </PageContainer>
    )
}