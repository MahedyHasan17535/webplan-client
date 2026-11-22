import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function StatCard({
    label,
    value,
    note,
    icon: Icon,
    className,
}: {
    label: string
    value: string | number
    note?: string
    icon?: LucideIcon
    className?: string
}) {
    return (
        <div className={cn("surface-card px-6 py-5", className)}>
            <div className="flex items-center justify-between gap-3">
                <dt className="text-[13px] text-[#A0A0AB]">{label}</dt>
                {Icon ? <Icon aria-hidden className="size-4 text-brand-soft" /> : null}
            </div>
            <dd className="mt-2.5 text-[26px] leading-8 font-semibold text-[#EDEDEF]">
                {value}
            </dd>
            {note ? <dd className="mt-1.5 text-[13px] text-[#A0A0AB]">{note}</dd> : null}
        </div>
    )
}