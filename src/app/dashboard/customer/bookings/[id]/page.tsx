import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { PageContainer } from "@/components/dashboard/page-shell"
import { ServiceImage } from "@/components/shared/service-image"
import { BookingStatusPill } from "@/components/shared/status-pill"
import { getBookingById } from "@/lib/api"
import { formatDate, formatPrice, formatTimestamp } from "@/lib/format"
import { cn } from "@/lib/utils"

export const metadata = { title: "Booking Details" }

export default async function BookingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    // The API only returns bookings that belong to this customer.
    const booking = await getBookingById(id)
    if (!booking) notFound()

    const vendorName = booking.vendor?.businessName || booking.vendor?.name || "Vendor"

    return (
        <PageContainer>
            <Link
                href="/dashboard/customer/bookings"
                className={cn(buttonVariants({ variant: "ghost" }), "mb-4 gap-2 px-2")}
            >
                <ArrowLeft aria-hidden /> Back to My Bookings
            </Link>

            <section className="surface-card overflow-hidden">
                <ServiceImage
                    src={booking.service?.images?.[0]}
                    alt={booking.service?.serviceName ?? "Service"}
                    className="aspect-[16/7] w-full"
                />
                <div className="flex flex-col gap-6 p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h1 className="page-title">{booking.service?.serviceName ?? "Removed service"}</h1>
                            {booking.service ? (
                                <p className="mt-1 text-sm text-white/60">{formatPrice(booking.service.price)}</p>
                            ) : null}
                        </div>
                        <BookingStatusPill status={booking.status} />
                    </div>

                    <dl className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <dt className="text-xs text-white/50 uppercase">Vendor</dt>
                            <dd className="mt-1 text-[#EDEDEF]">{vendorName}</dd>
                            {booking.vendor?.email ? (
                                <dd className="text-sm text-white/50">{booking.vendor.email}</dd>
                            ) : null}
                        </div>
                        <div>
                            <dt className="text-xs text-white/50 uppercase">Requested on</dt>
                            <dd className="mt-1 text-[#EDEDEF]">{formatTimestamp(booking.createdAt)}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-white/50 uppercase">Event date</dt>
                            <dd className="mt-1 flex items-center gap-2 text-[#EDEDEF]">
                                <CalendarDays aria-hidden className="size-4 text-brand-soft" />
                                {formatDate(booking.eventDate)}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-white/50 uppercase">Event location</dt>
                            <dd className="mt-1 flex items-center gap-2 text-[#EDEDEF]">
                                <MapPin aria-hidden className="size-4 text-brand-soft" />
                                {booking.eventLocation}
                            </dd>
                        </div>
                    </dl>

                    <div>
                        <h2 className="text-xs text-white/50 uppercase">Your message</h2>
                        <p className="mt-1 whitespace-pre-line text-white/70">
                            {booking.message || "You did not add a message."}
                        </p>
                    </div>
                </div>
            </section>
        </PageContainer>
    )
}