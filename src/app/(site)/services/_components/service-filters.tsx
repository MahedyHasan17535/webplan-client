"use client"
import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, MapPin, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SERVICE_CATEGORIES } from "@/lib/types"

const SORT_OPTIONS = [
    { value: "", label: "Newest first" },
    { value: "price_asc", label: "Price: low to high" },
    { value: "price_desc", label: "Price: high to low" },
]

const fieldClass =
    "surface-field h-11 w-full rounded-lg border px-3 text-sm text-[#EDEDEF] outline-none transition-colors"

export function ServiceFilters() {
    const router = useRouter()
    const params = useSearchParams()
    const [isPending, startTransition] = React.useTransition()

    const [search, setSearch] = React.useState(params.get("search") ?? "")
    const [location, setLocation] = React.useState(params.get("location") ?? "")

    const push = (changes: Record<string, string>) => {
        const next = new URLSearchParams(params.toString())
        for (const [key, value] of Object.entries(changes)) {
            if (value) next.set(key, value)
            else next.delete(key)
        }
        startTransition(() => router.push(`/services?${next.toString()}`))
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        push({ search: search.trim(), location: location.trim() })
    }

    const clearAll = () => {
        setSearch("")
        setLocation("")
        startTransition(() => router.push("/services"))
    }

    const hasFilters = ["search", "category", "location", "sort"].some((key) => params.get(key))

    return (
        <form
            onSubmit={handleSubmit}
            className="surface-card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]"
        >
            <div className="relative">
                <Search
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/50"
                />
                <input
                    aria-label="Search services by name"
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by service name"
                    className={`${fieldClass} pl-9`}
                />
            </div>

            <select
                aria-label="Filter by category"
                value={params.get("category") ?? ""}
                onChange={(event) => push({ category: event.target.value })}
                className={fieldClass}
            >
                <option value="" className="bg-[#1A1A1F]">All categories</option>
                {SERVICE_CATEGORIES.map((category) => (
                    <option key={category} value={category} className="bg-[#1A1A1F]">
                        {category}
                    </option>
                ))}
            </select>

            <div className="relative">
                <MapPin
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/50"
                />
                <input
                    aria-label="Filter by location"
                    type="text"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="Location"
                    className={`${fieldClass} pl-9`}
                />
            </div>

            <select
                aria-label="Sort by price"
                value={params.get("sort") ?? ""}
                onChange={(event) => push({ sort: event.target.value })}
                className={fieldClass}
            >
                {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-[#1A1A1F]">
                        {option.label}
                    </option>
                ))}
            </select>

            <div className="flex gap-2">
                <Button type="submit" className="btn-brand h-11 flex-1 px-5 text-white">
                    {isPending ? <Loader2 aria-hidden className="animate-spin" /> : null}
                    Search
                </Button>
                {hasFilters ? (
                    <Button
                        type="button"
                        variant="outline"
                        aria-label="Clear all filters"
                        onClick={clearAll}
                        className="h-11 px-3"
                    >
                        <X aria-hidden />
                    </Button>
                ) : null}
            </div>
        </form>
    )
}