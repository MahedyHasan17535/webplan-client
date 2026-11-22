import { Pill } from "@/components/shared/pill"
import { BOOKING_STATUS_META, type BookingStatus } from "@/lib/types"
import { SERVICE_STATUS_META, type ServiceStatus } from "@/lib/types"

export function ServiceStatusPill({ status }: { status: ServiceStatus }) {
    const { label, color } = SERVICE_STATUS_META[status]
    return <Pill label={label} color={color} dot />
}

export function BookingStatusPill({ status }: { status: BookingStatus }) {
    const { label, color } = BOOKING_STATUS_META[status]
    return <Pill label={label} color={color} dot />
}