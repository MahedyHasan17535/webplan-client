import { Search, Send, PartyPopper, type LucideIcon } from "lucide-react"

import { Reveal } from "@/components/home/reveal"
import { SectionHeading } from "@/components/home/section-heading"

const STEPS: { icon: LucideIcon; title: string; description: string }[] = [
    {
        icon: Search,
        title: "Browse services",
        description: "Explore photographers, venues, florists and more. Filter by category, location and price.",
    },
    {
        icon: Send,
        title: "Send a booking request",
        description: "Pick your event date and location, add a message and the vendor gets your request instantly.",
    },
    {
        icon: PartyPopper,
        title: "Celebrate",
        description: "Track the vendor's reply from your dashboard, then relax while your day comes together.",
    },
]

export function HowItWorks() {
    return (
        <section className="border-t border-white/10 bg-[#0B0B0E] py-20">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
                <Reveal>
                    <SectionHeading
                        overline="How it works"
                        title="How WedPlan Works"
                        subtitle="From first idea to confirmed vendor in three simple steps."
                    />
                </Reveal>

                <ol className="grid list-none gap-6 md:grid-cols-3">
                    {STEPS.map(({ icon: Icon, title, description }, index) => (
                        <li key={title}>
                            <Reveal delay={index * 0.1} className="h-full">
                                <div className="surface-card relative h-full p-8 text-center">
                                    <span
                                        aria-hidden
                                        className="gold-chip absolute -top-4 left-1/2 flex size-8 -translate-x-1/2 items-center justify-center rounded-full text-sm font-semibold"
                                    >
                                        {index + 1}
                                    </span>
                                    <span className="brand-chip mx-auto mb-4 flex size-14 items-center justify-center rounded-full">
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
                </ol>
            </div>
        </section>
    )
}