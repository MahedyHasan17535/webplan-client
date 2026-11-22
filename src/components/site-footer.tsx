import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

import { WedPlanLogo } from "@/components/site-navbar"

const FOOTER_LINKS = [
    { label: "Home", href: "/" },
    { label: "Browse Services", href: "/services" },
    { label: "Sign In", href: "/sign-in" },
    { label: "Sign Up", href: "/sign-up" },
]

const SOCIAL_LINKS = [
    { label: "Facebook", href: "https://facebook.com" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Pinterest", href: "https://pinterest.com" },
    { label: "YouTube", href: "https://youtube.com" },
]

const headingClass = "mb-4 font-heading text-sm font-semibold tracking-wide text-white uppercase"

export function SiteFooter() {
    return (
        <footer className="mt-24 border-t border-white/10 bg-[#0B0B0E]">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col gap-4">
                    <WedPlanLogo />
                    <p className="max-w-xs text-sm leading-relaxed text-white/60">
                        WedPlan connects couples with trusted wedding vendors, from
                        photographers to venues, so planning feels joyful instead of stressful.
                    </p>
                </div>

                <nav aria-label="Footer navigation">
                    <h2 className={headingClass}>Quick links</h2>
                    <ul className="flex flex-col gap-2.5 text-sm">
                        {FOOTER_LINKS.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="text-white/60 transition-colors hover:text-white"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div>
                    <h2 className={headingClass}>Contact</h2>
                    <ul className="flex flex-col gap-3 text-sm text-white/60">
                        <li className="flex items-center gap-2.5">
                            <Mail aria-hidden className="size-4 text-brand-soft" />
                            hello@wedplan.com
                        </li>
                        <li className="flex items-center gap-2.5">
                            <Phone aria-hidden className="size-4 text-brand-soft" />
                            +880 1700 000000
                        </li>
                        <li className="flex items-center gap-2.5">
                            <MapPin aria-hidden className="size-4 text-brand-soft" />
                            Dhaka, Bangladesh
                        </li>
                    </ul>
                </div>

                <div>
                    <h2 className={headingClass}>Follow us</h2>
                    <ul className="flex flex-wrap gap-2">
                        {SOCIAL_LINKS.map((link) => (
                            <li key={link.label}>
                                <a
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex h-9 items-center rounded-full border border-white/10 bg-[#1A1A1F] px-4 text-sm text-white/70 transition-colors hover:border-brand/60 hover:text-white"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
                © {new Date().getFullYear()} WedPlan. All rights reserved.
            </div>
        </footer>
    )
}