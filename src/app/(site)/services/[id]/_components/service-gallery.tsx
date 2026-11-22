"use client"

import * as React from "react"

import { ServiceImage } from "@/components/shared/service-image"
import { cn } from "@/lib/utils"

export function ServiceGallery({ images, name }: { images: string[]; name: string }) {
    const [active, setActive] = React.useState(0)

    return (
        <div className="flex flex-col gap-3">
            <ServiceImage
                src={images[active]}
                alt={`${name} — photo ${active + 1}`}
                className="aspect-[16/10] w-full rounded-2xl border border-white/10"
            />

            {images.length > 1 ? (
                <ul className="grid list-none grid-cols-5 gap-3">
                    {images.map((image, index) => (
                        <li key={image}>
                            <button
                                type="button"
                                aria-label={`Show photo ${index + 1}`}
                                aria-current={index === active}
                                onClick={() => setActive(index)}
                                className={cn(
                                    "block w-full overflow-hidden rounded-lg border-2 transition-colors",
                                    index === active ? "border-brand" : "border-transparent opacity-70 hover:opacity-100"
                                )}
                            >
                                <ServiceImage src={image} alt="" className="aspect-square w-full" />
                            </button>
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    )
}