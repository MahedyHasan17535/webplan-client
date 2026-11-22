import { BadgeCheck, CalendarCheck, Scale, ShieldCheck, type LucideIcon } from "lucide-react"

import { Reveal } from "@/components/home/reveal"
import { SectionHeading } from "@/components/home/section-heading"

const BENEFITS: { icon: LucideIcon; title: string; description: string }[] = [
    {
        icon: ShieldCheck,
        title: "Reviewed by our team",
        description:
            "Every service is checked by an admin before it appears, so you only see listings that are ready for real couples.",
    },
    {
        icon: Scale,
        title: "Compare with confidence",
        description:
            "Search, filter by category or location and sort by price to find the right fit for your budget in minutes.",
    },
    {
        icon: CalendarCheck,
        title: "Simple booking requests",
        description:
            "Send your date, location and wishes to a vendor and track the answer from your dashboard. No endless emails.",
    },
    {
        icon: BadgeCheck,
        title: "Premium vendors stand out",
        description:
            "Vendors who go Premium publish unlimited services and earn a badge that shows they are serious about your day.",
    },
]

export function WhyChoose() {
    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
            <Reveal>
                <SectionHeading
                    overline="Why WedPlan"
                    title="Why Choose WedPlan?"
                    subtitle="Built for couples who want clarity and for vendors who want to be found."
                />
            </Reveal>

            <ul className="grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {BENEFITS.map(({ icon: Icon, title, description }, index) => (
                    <li key={title}>
                        <Reveal delay={index * 0.08} className="h-full">
                            <div className="surface-card h-full p-6">
                                <span className="brand-chip mb-4 flex size-12 items-center justify-center rounded-xl">
                                    <Icon aria-hidden className="size-6" />
                                </span>
                                <h3 className="mb-2 font-heading text-lg font-semibold text-[#EDEDEF]">
                                    {title}
                                </h3>
                                <p className="text-sm leading-relaxed text-white/60">{description}</p>
                            </div>
                        </Reveal>
                    </li>
                ))}
            </ul>
        </section>
    )
}