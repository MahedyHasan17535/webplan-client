"use client"

// Customer My Bookings: details link for every request and Cancel for pending
// ones. The API refuses to cancel anything that is not pending or not theirs.

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { ServiceImage } from "@/components/shared/service-image"
import { BookingStatusPill } from "@/components/shared/status-pill"
import { toast } from "@/components/ui/toast"
import { cancelBooking } from "@/lib/api"
import { formatDate, formatTimestamp } from "@/lib/format"
import type { BookingRow } from "@/lib/types"

export function CustomerBookingsTable({ bookings }: { bookings: BookingRow[] }) {
    const router = useRouter()

    const handleCancel = async (booking: BookingRow) => {
        const result = await cancelBooking(booking._id)
        if (!result.ok) {
            toast.add({
                type: "error",
                title: "Could not cancel request",
                description: result.message ?? "Please try again.",
            })
            router.refresh()
            return
        }
        toast.add({ type: "success", title: "Request cancelled", description: booking.service?.serviceName })
        router.refresh()
    }

    return (
        <div className="surface-card overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="border-b border-white/10 text-xs text-white/50 uppercase">
                    <tr>
                        <th className="px-5 py-3 font-medium">Service</th>
                        <th className="px-5 py-3 font-medium">Vendor</th>
                        <th className="px-5 py-3 font-medium">Event</th>
                        <th className="px-5 py-3 font-medium">Requested</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 text-right font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                    {bookings.map((booking) => (
                        <tr key={booking._id}>
                            <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <ServiceImage
                                        src={booking.service?.images?.[0]}
                                        alt=""
                                        className="size-12 shrink-0 rounded-lg"
                                    />
                                    <p className="max-w-48 truncate font-medium text-[#EDEDEF]">
                                        {booking.service?.serviceName ?? "Removed service"}
                                    </p>
                                </div>
                            </td>
                            <td className="px-5 py-4 text-white/70">
                                {booking.vendor?.businessName || booking.vendor?.name || "Vendor"}
                            </td>
                            <td className="px-5 py-4">
                                <p className="text-[#EDEDEF]">{formatDate(booking.eventDate)}</p>
                                <p className="text-xs text-white/50">{booking.eventLocation}</p>
                            </td>
                            <td className="px-5 py-4 text-white/70">{formatTimestamp(booking.createdAt)}</td>
                            <td className="px-5 py-4">
                                <BookingStatusPill status={booking.status} />
                            </td>
                            <td className="px-5 py-4">
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        render={<Link href={`/dashboard/customer/bookings/${booking._id}`} />}
                                        nativeButton={false}
                                        variant="outline"
                                        size="sm"
                                        className="gap-1"
                                    >
                                        <Eye aria-hidden /> Details
                                    </Button>
                                    {booking.status === "pending" ? (
                                        <ConfirmDialog
                                            trigger={
                                                <Button variant="outline" size="sm" className="gap-1">
                                                    <XCircle aria-hidden /> Cancel
                                                </Button>
                                            }
                                            title="Cancel this request?"
                                            description="The vendor will no longer see this request as pending."
                                            confirmLabel="Cancel request"
                                            destructive
                                            onConfirm={() => handleCancel(booking)}
                                        />
                                    ) : null}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}