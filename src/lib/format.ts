// Display formatters shared between public pages and dashboards.

/** 1200 → "$1,200". */
export const formatPrice = (price: number, currency = "USD") =>
    new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(price)

/** "2026-12-05" → "Dec 05, 2026". Fixed en-US so SSR and client agree. */
export const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric", timeZone: "UTC" })

/** ISO timestamp → "Dec 05, 2026". Local calendar day, fixed en-US. */
export const formatTimestamp = (timestamp: string) =>
    new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })

/** Today as "YYYY-MM-DD" for the date input `min` attribute. */
export const todayInputValue = () => new Date().toISOString().slice(0, 10)

/** A vendor is Premium only while the paid period has not ended. */
export const isPremiumVendor = (vendor?: {
    subscriptionPlan?: string
    subscriptionExpiresAt?: string | null
}) =>
    vendor?.subscriptionPlan === "premium" &&
    Boolean(vendor.subscriptionExpiresAt) &&
    new Date(vendor.subscriptionExpiresAt as string) > new Date()