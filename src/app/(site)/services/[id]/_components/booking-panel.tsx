"use client"
import * as React from "react"
import { useRouter } from "next/navigation"
import { CalendarHeart, Info, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field } from "@/components/shared/field"
import { toast } from "@/components/ui/toast"
import { createBooking } from "@/lib/api"
import { todayInputValue } from "@/lib/format"
import type { UserRole } from "@/lib/types"

export function BookingPanel({
    serviceId,
    role,
    bookable,
}: {
    serviceId: string
    role: UserRole
    /** Approved + active service. */
    bookable: boolean
}) {
    const router = useRouter()
    const [open, setOpen] = React.useState(false)
    const [submitting, setSubmitting] = React.useState(false)
    const [values, setValues] = React.useState({ eventDate: "", eventLocation: "", message: "" })

    if (!bookable) {
        return (
            <p className="flex gap-2 rounded-lg border border-white/10 bg-[#1A1A1F] p-3 text-sm text-white/60">
                <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
                This service is not available for booking right now.
            </p>
        )
    }

    if (role !== "customer") {
        return (
            <p className="flex gap-2 rounded-lg border border-white/10 bg-[#1A1A1F] p-3 text-sm text-white/60">
                <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
                {role === "vendor"
                    ? "Vendor accounts cannot submit booking requests."
                    : "Admin accounts cannot submit customer booking requests."}
            </p>
        )
    }

    const setField =
        (field: keyof typeof values) =>
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setValues((prev) => ({ ...prev, [field]: event.target.value }))

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSubmitting(true)

        const result = await createBooking({ serviceId, ...values })
        setSubmitting(false)

        if (!result.ok) {
            toast.add({
                type: "error",
                title: "Booking request failed",
                description: result.message ?? "Please check the form and try again.",
            })
            return
        }

        toast.add({
            type: "success",
            title: "Booking request sent",
            description: "The vendor will review it. Track the status in My Bookings.",
        })
        router.push("/dashboard/customer/bookings")
    }

    if (!open) {
        return (
            <Button
                onClick={() => setOpen(true)}
                className="btn-brand h-12 w-full gap-2 text-base text-white"
            >
                <CalendarHeart aria-hidden />
                Request Booking
            </Button>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Event date" htmlFor="eventDate" required>
                <Input
                    id="eventDate"
                    type="date"
                    required
                    min={todayInputValue()}
                    value={values.eventDate}
                    onChange={setField("eventDate")}
                    className="surface-field h-11"
                />
            </Field>

            <Field label="Event location" htmlFor="eventLocation" required>
                <Input
                    id="eventLocation"
                    required
                    minLength={3}
                    value={values.eventLocation}
                    onChange={setField("eventLocation")}
                    placeholder="Venue or city"
                    className="surface-field h-11"
                />
            </Field>

            <Field label="Additional message" htmlFor="message" hint="Optional, up to 1000 characters">
                <Textarea
                    id="message"
                    rows={4}
                    maxLength={1000}
                    value={values.message}
                    onChange={setField("message")}
                    placeholder="Tell the vendor about your wedding"
                    className="surface-field"
                />
            </Field>

            <div className="flex gap-2">
                <Button type="submit" disabled={submitting} className="btn-brand h-11 flex-1 text-white">
                    {submitting ? <Loader2 aria-hidden className="animate-spin" /> : null}
                    {submitting ? "Sending…" : "Send request"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-11">
                    Cancel
                </Button>
            </div>
        </form>
    )
}