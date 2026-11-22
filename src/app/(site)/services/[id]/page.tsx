import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Crown, MapPin, Tag } from "lucide-react"

import { PageContainer } from "@/components/dashboard/page-shell"
import { Pill } from "@/components/shared/pill"
import { UserAvatar } from "@/components/shared/user-avatar"
import { requireSession } from "@/lib/server"
import { getServiceById } from "@/lib/api"
import { formatPrice, isPremiumVendor } from "@/lib/format"
import { BookingPanel } from "./_components/booking-panel"
import { ServiceGallery } from "./_components/service-gallery"

export const metadata: Metadata = { title: "Service Details" }

export default async function ServiceDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const session = await requireSession(`/services/${id}`)

    const service = await getServiceById(id)
    if (!service) notFound()

    const vendorName = service.vendor?.businessName || service.vendor?.name || "WedPlan vendor"
    const bookable = service.status === "approved" && service.isActive

    return (
        <PageContainer width="wide">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
                <div className="flex min-w-0 flex-col gap-8">
                    <ServiceGallery images={service.images} name={service.serviceName} />

                    <section className="surface-card p-6">
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                            <Pill label={service.category} color="#F2A3B6" />
                            {!bookable ? <Pill label="Not publicly available" color="#F59E0B" /> : null}
                        </div>
                        <h1 className="page-title mb-4">{service.serviceName}</h1>
                        <p className="flex items-center gap-1.5 text-sm text-white/60">
                            <MapPin aria-hidden className="size-4" />
                            {service.location}
                        </p>

                        <h2 className="mt-8 mb-3 font-heading text-lg font-semibold text-white">
                            About this service
                        </h2>
                        <p className="leading-relaxed whitespace-pre-line text-white/70">
                            {service.description}
                        </p>
                    </section>
                </div>

                <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
                    <section className="surface-card flex flex-col gap-5 p-6">
                        <div>
                            <p className="flex items-center gap-1.5 text-sm text-white/50">
                                <Tag aria-hidden className="size-4" />
                                Starting price
                            </p>
                            <p className="mt-1 text-3xl font-bold text-white">
                                {formatPrice(service.price)}
                            </p>
                        </div>

                        <BookingPanel
                            serviceId={service._id}
                            role={session.user.role}
                            bookable={bookable}
                        />
                    </section>

                    <section className="surface-card p-6">
                        <h2 className="mb-4 font-heading text-lg font-semibold text-white">Vendor</h2>
                        <div className="flex items-center gap-3">
                            <UserAvatar
                                src={service.vendor?.image}
                                name={vendorName}
                                className="size-12"
                            />
                            <div className="flex min-w-0 flex-col gap-1">
                                <span className="truncate font-medium text-[#EDEDEF]">{vendorName}</span>
                                {service.vendor?.name && service.vendor.name !== vendorName ? (
                                    <span className="truncate text-sm text-white/50">
                                        {service.vendor.name}
                                    </span>
                                ) : null}
                                {isPremiumVendor(service.vendor) ? (
                                    <span className="gold-chip inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium">
                                        <Crown aria-hidden className="size-3" />
                                        Premium Vendor
                                    </span>
                                ) : null}
                            </div>
                        </div>
                        {service.vendor?.email ? (
                            <p className="mt-4 truncate text-sm text-white/60">{service.vendor.email}</p>
                        ) : null}
                    </section>
                </aside>
            </div>
        </PageContainer>
    )
}