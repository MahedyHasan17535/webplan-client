import Link from "next/link"
import {
    Camera,
    Flower2,
    Landmark,
    Shirt,
    Sparkles,
    UtensilsCrossed,
    type LucideIcon,
} from "lucide-react"

import { Reveal } from "@/components/home/reveal"
import { SectionHeading } from "@/components/home/section-heading"
import { SERVICE_CATEGORIES, type CategoryCount, type ServiceCategory } from "@/lib/types"

const CATEGORY_ICONS: Record<ServiceCategory, LucideIcon> = {
    "Photography & Videography": Camera,
    "Wedding Venues": Landmark,
    "Decoration & Florist": Flower2,
    "Catering Services": UtensilsCrossed,
    "Makeup & Styling": Sparkles,
    "Wedding Fashion": Shirt,
}

export function CategoryGrid({ counts }: { counts: CategoryCount[] }) {
    const countOf = (name: string) => counts.find((category) => category.name === name)?.count ?? 0

    return (
        <section className="border-y border-white/10 bg-[#0B0B0E] py-20">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
                <Reveal>
                    <SectionHeading
                        overline="Categories"
                        title="Wedding Service Categories"
                        subtitle="Explore everything you need, organised by category."
                    />
                </Reveal>

                <Reveal>
                    <ul className="grid list-none grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
                        {SERVICE_CATEGORIES.map((name) => {
                            const Icon = CATEGORY_ICONS[name]
                            const count = countOf(name)

                            return (
                                <li key={name}>
                                    <Link
                                        href={`/services?category=${encodeURIComponent(name)}`}
                                        className="surface-card group flex h-full flex-col items-center gap-3 p-6 text-center transition-colors hover:border-brand/60"
                                    >
                                        <span className="brand-chip flex size-14 items-center justify-center rounded-full transition-transform group-hover:scale-110">
                                            <Icon aria-hidden className="size-6" />
                                        </span>
                                        <h3 className="font-heading text-base font-semibold text-[#EDEDEF] sm:text-lg">
                                            {name}
                                        </h3>
                                        <p className="text-sm text-white/50">
                                            {count} {count === 1 ? "service" : "services"}
                                        </p>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </Reveal>
            </div>
        </section>
    )
}