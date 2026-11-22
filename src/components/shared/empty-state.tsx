// Empty / error state card — icon, message and an optional action slot.

import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
}: {
    icon: LucideIcon
    title: string
    description?: string
    /** e.g. a Link styled with buttonVariants. */
    action?: React.ReactNode
    className?: string
}) {
    return (
        <div
            className={cn(
                "surface-card flex flex-col items-center gap-3 p-10 text-center",
                className
            )}
        >
            <span className="brand-chip flex size-12 items-center justify-center rounded-full">
                <Icon aria-hidden className="size-6" />
            </span>
            <h3 className="font-heading text-lg font-semibold text-white">{title}</h3>
            {description ? (
                <p className="max-w-md text-sm text-white/60">{description}</p>
            ) : null}
            {action}
        </div>
    )
}