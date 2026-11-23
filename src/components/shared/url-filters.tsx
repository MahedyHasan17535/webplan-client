"use client"
import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Loader2, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"

type FilterSelect = {
    name: string
    label: string
    options: { value: string; label: string }[]
}

const fieldClass =
    "surface-field h-11 w-full rounded-lg border px-3 text-sm text-[#EDEDEF] outline-none transition-colors"

export function UrlFilters({
    searchPlaceholder,
    selects,
}: {
    searchPlaceholder: string
    selects: FilterSelect[]
}) {
    const router = useRouter()
    const pathname = usePathname()
    const params = useSearchParams()
    const [isPending, startTransition] = React.useTransition()
    const [search, setSearch] = React.useState(params.get("search") ?? "")

    const push = (changes: Record<string, string>) => {
        const next = new URLSearchParams(params.toString())
        for (const [key, value] of Object.entries(changes)) {
            if (value) next.set(key, value)
            else next.delete(key)
        }
        startTransition(() => router.push(`${pathname}?${next.toString()}`))
    }

    const hasFilters = ["search", ...selects.map((select) => select.name)].some((key) => params.get(key))

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault()
                push({ search: search.trim() })
            }}
            className="surface-card mb-6 flex flex-wrap gap-3 p-4"
        >
            <div className="relative min-w-56 flex-1">
                <Search
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/50"
                />
                <input
                    type="search"
                    aria-label={searchPlaceholder}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={searchPlaceholder}
                    className={`${fieldClass} pl-9`}
                />
            </div>

            {selects.map((select) => (
                <select
                    key={select.name}
                    aria-label={select.label}
                    value={params.get(select.name) ?? ""}
                    onChange={(event) => push({ [select.name]: event.target.value })}
                    className={`${fieldClass} w-auto min-w-40`}
                >
                    <option value="" className="bg-[#1A1A1F]">{select.label}</option>
                    {select.options.map((option) => (
                        <option key={option.value} value={option.value} className="bg-[#1A1A1F]">
                            {option.label}
                        </option>
                    ))}
                </select>
            ))}

            <Button type="submit" className="btn-brand h-11 px-5 text-white">
                {isPending ? <Loader2 aria-hidden className="animate-spin" /> : null}
                Search
            </Button>
            {hasFilters ? (
                <Button
                    type="button"
                    variant="outline"
                    aria-label="Clear all filters"
                    onClick={() => {
                        setSearch("")
                        startTransition(() => router.push(pathname))
                    }}
                    className="h-11 px-3"
                >
                    <X aria-hidden />
                </Button>
            ) : null}
        </form>
    )
}