"use client"

import { motion, useReducedMotion } from "motion/react"

export function Reveal({
    children,
    delay = 0,
    className,
}: {
    children: React.ReactNode
    /** Seconds to wait before the animation starts (for staggering siblings). */
    delay?: number
    className?: string
}) {
    const reduceMotion = useReducedMotion()

    return (
        <motion.div
            className={className}
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    )
}