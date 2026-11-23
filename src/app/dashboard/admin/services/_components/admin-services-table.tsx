"use client"


import { useRouter } from "next/navigation"
import Link from "next/link"
import { Check, Eye, RotateCcw, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { ServiceImage } from "@/components/shared/service-image"
import { ServiceStatusPill } from "@/components/shared/status-pill"
import { toast } from "@/components/ui/toast"
import { deleteService, updateServiceStatus } from "@/lib/api"
import { formatPrice, formatTimestamp } from "@/lib/format"
import type { ServiceRow, ServiceStatus } from "@/lib/types"

export function AdminServicesTable({ services }: { services: ServiceRow[] }) {
    const router = useRouter()

    const handleStatus = async (service: ServiceRow, status: ServiceStatus) => {
        const result = await updateServiceStatus(service._id, status)
        if (!result.ok) {
            toast.add({
                type: "error",
                title: "Could not update service",
                description: result.message ?? "Please try again.",
            })
            return
        }
        toast.add({ type: "success", title: `Service ${status}`, description: service.serviceName })
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
            <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-white/10 text-xs text-white/50 uppercase">
                    <tr>
                        <th className="px-5 py-3 font-medium">Service</th>
                        <th className="px-5 py-3 font-medium">Vendor</th>
                        <th className="px-5 py-3 font-medium">Price</th>
                        <th className="px-5 py-3 font-medium">Submitted</th>
                        <th className="px-5 py-3 font-medium">Status</th>
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
                                        className="size-12 shrink-0 rounded-lg"
                                    />
                                    <div className="min-w-0">
                                        <p className="max-w-52 truncate font-medium text-[#EDEDEF]">{service.serviceName}</p>
                                        <p className="truncate text-xs text-white/50">
                                            {service.category}
                                            {service.isActive ? "" : " · paused by vendor"}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-5 py-4 text-white/70">
                                {service.vendor?.businessName || service.vendor?.name || "Unknown"}
                            </td>
                            <td className="px-5 py-4 text-[#EDEDEF]">{formatPrice(service.price)}</td>
                            <td className="px-5 py-4 text-white/70">{formatTimestamp(service.createdAt)}</td>
                            <td className="px-5 py-4"><ServiceStatusPill status={service.status} /></td>
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
                                    {service.status !== "approved" ? (
                                        <Button
                                            size="sm"
                                            className="btn-brand gap-1 text-white"
                                            onClick={() => handleStatus(service, "approved")}
                                        >
                                            <Check aria-hidden /> Approve
                                        </Button>
                                    ) : null}
                                    {service.status !== "rejected" ? (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="gap-1"
                                            onClick={() => handleStatus(service, "rejected")}
                                        >
                                            <X aria-hidden /> Reject
                                        </Button>
                                    ) : null}
                                    {service.status === "approved" ? (
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            aria-label={`Move ${service.serviceName} back to pending`}
                                            onClick={() => handleStatus(service, "pending")}
                                        >
                                            <RotateCcw />
                                        </Button>
                                    ) : null}
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
                                        description="Use this for inappropriate services. It is removed permanently."
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