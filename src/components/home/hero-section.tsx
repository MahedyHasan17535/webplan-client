"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"
import { ArrowRight, Sparkles } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"


const HERO_IMAGE =
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=70"

export function HeroSection() {
    const reduceMotion = useReducedMotion()

    const fadeUp = (delay: number) => ({
        initial: reduceMotion ? false : { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay, ease: "easeOut" as const },
    })

    return (
        <section className="relative -mt-[84px] overflow-hidden bg-[#1a0d12]">
            <div
                aria-hidden
                className="absolute inset-0 bg-cover bg-center opacity-50"
                style={{ backgroundImage: `url(${HERO_IMAGE})` }}
            />
            <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-b from-[#08080a]/70 via-[#08080a]/55 to-[#08080a]"
            />
            <div aria-hidden className="wedding-glow absolute inset-0 opacity-60" />

            <div className="relative mx-auto flex min-h-[640px] max-w-4xl flex-col items-center justify-center gap-6 px-4 pt-32 pb-24 text-center sm:px-6">
                <motion.p
                    {...fadeUp(0)}
                    className="gold-chip inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm"
                >
                    <Sparkles aria-hidden className="size-4" />
                    The wedding marketplace couples love
                </motion.p>

                <motion.h1
                    {...fadeUp(0.1)}
                    className="font-heading text-4xl leading-[1.1] font-bold tracking-[-0.03em] text-white sm:text-6xl"
                >
                    Plan the wedding you&apos;ve always dreamed of
                </motion.h1>

                <motion.p
                    {...fadeUp(0.2)}
                    className="max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg"
                >
                    Discover trusted photographers, venues, florists, caterers and more.
                    Compare services and send booking requests, all in one place.
                </motion.p>

                <motion.div {...fadeUp(0.3)}>
                    <Link
                        href="/services"
                        className={cn(
                            buttonVariants({ size: "lg" }),
                            "btn-brand h-12 gap-2 px-7 text-base text-white shadow-[inset_0_3px_10px_rgba(255,255,255,0.2)]"
                        )}
                    >
                        Explore Wedding Services
                        <ArrowRight aria-hidden />
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}