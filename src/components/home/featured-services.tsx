import Link from "next/link"
import { Heart } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { ServiceCard } from "@/components/shared/service-card"
import { Reveal } from "@/components/home/reveal"
import { SectionHeading } from "@/components/home/section-heading"
import type { ServiceRow } from "@/lib/types"
import { cn } from "@/lib/utils"

export function FeaturedServices({ services }: { services: ServiceRow[] }) {
    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
            <Reveal>
                <SectionHeading
                    overline="Featured"
                    title="Featured Wedding Services"
                    subtitle="Hand-picked services from approved vendors, ready to book for your big day."
                />
            </Reveal>

            {services.length > 0 ? (
                <Reveal>
                    <ul className="grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {services.slice(0, 6).map((service) => (
                            <ServiceCard key={service._id} service={service} />
                        ))}
                    </ul>
                </Reveal>
            ) : (
                <EmptyState
                    icon={Heart}
                    title="Services are coming soon"
                    description="Vendors are publishing their services right now. Check back shortly."
                />
            )}

            <div className="mt-10 flex justify-center">
                <Link
                    href="/services"
                    className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-6")}
                >
                    View all services
                </Link>
            </div>
        </section>
    )
}