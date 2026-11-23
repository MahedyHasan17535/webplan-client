"use client"

// Vendor "My Services" table: view, edit, delete, approval status and the
// availability switch. A rejected service is never visible to customers.

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { ServiceImage } from "@/components/shared/service-image"
import { ServiceStatusPill } from "@/components/shared/status-pill"
import { toast } from "@/components/ui/toast"
import { deleteService, setServiceAvailability } from "@/lib/api"
import { formatPrice } from "@/lib/format"
import type { ServiceRow } from "@/lib/types"

export function VendorServicesTable({ services }: { services: ServiceRow[] }) {
    const router = useRouter()
    const [busyId, setBusyId] = React.useState<string | null>(null)

    const handleAvailability = async (service: ServiceRow, isActive: boolean) => {
        setBusyId(service._id)
        const result = await setServiceAvailability(service._id, isActive)
        setBusyId(null)

        if (!result.ok) {
            toast.add({
                type: "error",
                title: "Could not change availability",
                description: result.message ?? "Please try again.",
            })
            return
        }
        toast.add({
            type: "success",
            title: isActive ? "Service is available" : "Service paused",
            description: isActive
                ? "Customers can book it once it is approved."
                : "Customers can no longer see or book it.",
        })
        router.refresh()
    }

    const handleDelete = async (service: ServiceRow) => {
        const result = await deleteService(service._id)
        if (!result.ok) {
            toast.add({
                type: "error",
                title: "Could not delete service",
                description: result.message ?? "Please try again.",
            })
            return
        }
        toast.add({ type: "success", title: "Service deleted", description: service.serviceName })
        router.refresh()
    }

    return (
        <div className="surface-card overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-white/10 text-xs text-white/50 uppercase">
                    <tr>
                        <th className="px-5 py-3 font-medium">Service</th>
                        <th className="px-5 py-3 font-medium">Price</th>
                        <th className="px-5 py-3 font-medium">Approval</th>
                        <th className="px-5 py-3 font-medium">Available</th>
                        <th className="px-5 py-3 text-right font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                    {services.map((service) => (
                        <tr key={service._id}>
                            <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <ServiceImage
                                        src={service.images?.[0]}
                                        alt=""
                                        className="size-14 shrink-0 rounded-lg"
                                    />
                                    <div className="min-w-0">
                                        <p className="truncate font-medium text-[#EDEDEF]">{service.serviceName}</p>
                                        <p className="truncate text-xs text-white/50">
                                            {service.category} · {service.location}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-5 py-4 text-[#EDEDEF]">{formatPrice(service.price)}</td>
                            <td className="px-5 py-4">
                                <ServiceStatusPill status={service.status} />
                                {service.status === "rejected" ? (
                                    <p className="mt-1 text-xs text-white/40">Hidden from customers</p>
                                ) : null}
                            </td>
                            <td className="px-5 py-4">
                                <Switch
                                    aria-label={`Availability of ${service.serviceName}`}
                                    checked={service.isActive}
                                    disabled={busyId === service._id}
                                    onCheckedChange={(checked) => handleAvailability(service, checked)}
                                />
                            </td>
                            <td className="px-5 py-4">
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        render={<Link href={`/services/${service._id}`} />}
                                        nativeButton={false}
                                        variant="outline"
                                        size="icon"
                                        aria-label={`View ${service.serviceName}`}
                                    >
                                        <Eye />
                                    </Button>
                                    <Button
                                        render={<Link href={`/dashboard/vendor/services/${service._id}/edit`} />}
                                        nativeButton={false}
                                        variant="outline"
                                        size="icon"
                                        aria-label={`Edit ${service.serviceName}`}
                                    >
                                        <Pencil />
                                    </Button>
                                    <ConfirmDialog
                                        trigger={
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                aria-label={`Delete ${service.serviceName}`}
                                            >
                                                <Trash2 />
                                            </Button>
                                        }
                                        title="Delete this service?"
                                        description="The service and its pending booking requests will be removed. This cannot be undone."
                                        confirmLabel="Delete"
                                        destructive
                                        onConfirm={() => handleDelete(service)}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}