export function SectionHeading({
    overline,
    title,
    subtitle,
}: {
    overline: string
    title: string
    subtitle?: string
}) {
    return (
        <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-2 text-center">
            <p className="overline-label">{overline}</p>
            <h2 className="font-heading text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
                {title}
            </h2>
            {subtitle ? <p className="text-base text-white/60">{subtitle}</p> : null}
        </div>
    )
}