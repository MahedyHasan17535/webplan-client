"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { BookingStatusPill } from "@/components/shared/status-pill"
import { UserAvatar } from "@/components/shared/user-avatar"
import { toast } from "@/components/ui/toast"
import { updateBookingStatus } from "@/lib/api"
import { formatDate, formatPrice } from "@/lib/format"
import type { BookingRow } from "@/lib/types"

export function BookingRequestsTable({ bookings }: { bookings: BookingRow[] }) {
    const router = useRouter()

    const handleStatus = async (booking: BookingRow, status: "accepted" | "rejected") => {
        const result = await updateBookingStatus(booking._id, status)

        if (!result.ok) {
            toast.add({
                type: "error",
                title: "Could not update request",
                description: result.message ?? "Please try again.",
            })
            router.refresh()
            return
        }
        toast.add({
            type: "success",
            title: status === "accepted" ? "Request accepted" : "Request rejected",
            description: `${booking.customer?.name ?? "The customer"} can now see your answer.`,
        })
        router.refresh()
    }

    return (
        <div className="surface-card overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-white/10 text-xs text-white/50 uppercase">
                    <tr>
                        <th className="px-5 py-3 font-medium">Customer</th>
                        <th className="px-5 py-3 font-medium">Service</th>
                        <th className="px-5 py-3 font-medium">Event</th>
                        <th className="px-5 py-3 font-medium">Message</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 text-right font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                    {bookings.map((booking) => (
                        <tr key={booking._id} className="align-top">
                            <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <UserAvatar
                                        src={booking.customer?.image}
                                        name={booking.customer?.name}
                                        className="size-9"
                                    />
                                    <div className="min-w-0">
                                        <p className="truncate font-medium text-[#EDEDEF]">
                                            {booking.customer?.name ?? "Customer"}
                                        </p>
                                        <p className="truncate text-xs text-white/50">{booking.customer?.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-5 py-4">
                                <p className="font-medium text-[#EDEDEF]">{booking.service?.serviceName ?? "Removed service"}</p>
                                {booking.service ? (
                                    <p className="text-xs text-white/50">{formatPrice(booking.service.price)}</p>
                                ) : null}
                            </td>
                            <td className="px-5 py-4">
                                <p className="text-[#EDEDEF]">{formatDate(booking.eventDate)}</p>
                                <p className="text-xs text-white/50">{booking.eventLocation}</p>
                            </td>
                            <td className="max-w-56 px-5 py-4 text-white/70">
                                {booking.message ? (
                                    <p className="line-clamp-3" title={booking.message}>{booking.message}</p>
                                ) : (
                                    <span className="text-white/30">No message</span>
                                )}
                            </td>
                            <td className="px-5 py-4">
                                <BookingStatusPill status={booking.status} />
                            </td>
                            <td className="px-5 py-4">
                                {booking.status === "pending" ? (
                                    <div className="flex justify-end gap-2">
                                        <ConfirmDialog
                                            trigger={
                                                <Button size="sm" className="btn-brand gap-1 text-white">
                                                    <Check aria-hidden /> Accept
                                                </Button>
                                            }
                                            title="Accept this request?"
                                            description="The customer will see that you accepted. You cannot change this later."
                                            confirmLabel="Accept"
                                            onConfirm={() => handleStatus(booking, "accepted")}
                                        />
                                        <ConfirmDialog
                                            trigger={
                                                <Button size="sm" variant="outline" className="gap-1">
                                                    <X aria-hidden /> Reject
                                                </Button>
                                            }
                                            title="Reject this request?"
                                            description="The customer will see that you rejected it. You cannot change this later."
                                            confirmLabel="Reject"
                                            destructive
                                            onConfirm={() => handleStatus(booking, "rejected")}
                                        />
                                    </div>
                                ) : (
                                    <p className="text-right text-xs text-white/40">Already processed</p>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}