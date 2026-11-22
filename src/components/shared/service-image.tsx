import { ImageOff } from "lucide-react"
import { cn } from "@/lib/utils"

export function ServiceImage({
    src,
    alt,
    className,
}: {
    src?: string
    alt: string
    className?: string
}) {
    if (!src) {
        return (
            <div
                className={cn(
                    "flex items-center justify-center bg-[#1A1A1F] text-white/30",
                    className
                )}
            >
                <ImageOff aria-label="No image available" className="size-8" />
            </div>
        )
    }

    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading="lazy" className={cn("object-cover", className)} />
}