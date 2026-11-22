import Link from "next/link"
import { Crown, MapPin } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Pill } from "@/components/shared/pill"
import { ServiceImage } from "@/components/shared/service-image"
import { UserAvatar } from "@/components/shared/user-avatar"
import { formatPrice, isPremiumVendor } from "@/lib/format"
import type { ServiceRow } from "@/lib/types"
import { cn } from "@/lib/utils"

export function ServiceCard({ service }: { service: ServiceRow }) {
    const vendorName = service.vendor?.businessName || service.vendor?.name || "WedPlan vendor"

    return (
        <li className="surface-card flex flex-col overflow-hidden">
            <ServiceImage
                src={service.images?.[0]}
                alt={service.serviceName}
                className="aspect-[4/3] w-full"
            />

            <div className="flex flex-1 flex-col gap-3 p-5">
                <Pill label={service.category} color="#F2A3B6" className="self-start" />

                <h3 className="font-heading text-lg leading-snug font-semibold text-[#EDEDEF]">
                    {service.serviceName}
                </h3>

                <p className="flex items-center gap-1.5 text-sm text-[#A0A0AB]">
                    <MapPin aria-hidden className="size-4 shrink-0" />
                    <span className="truncate">{service.location}</span>
                </p>

                <div className="flex items-center gap-2.5 border-t border-white/10 pt-3">
                    <UserAvatar
                        src={service.vendor?.image}
                        name={vendorName}
                        className="size-8"
                    />
                    <span className="min-w-0 flex-1 truncate text-sm text-[#EDEDEF]/80">
                        {vendorName}
                    </span>
                    {isPremiumVendor(service.vendor) ? (
                        <span className="gold-chip inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium">
                            <Crown aria-hidden className="size-3" />
                            Premium
                        </span>
                    ) : null}
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                    <p className="text-lg font-semibold text-[#EDEDEF]">
                        {formatPrice(service.price)}
                    </p>
                    <Link
                        href={`/services/${service._id}`}
                        className={cn(buttonVariants(), "btn-brand text-white")}
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </li>
    )
}