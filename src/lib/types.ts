// All shared domain types and constants (users, services, bookings, transactions, stats).

// ---- user ----
// Roles mirror the `user.additionalFields.role` enum in `lib/auth.ts`.
export type UserRole = "customer" | "vendor" | "admin"
export type SubscriptionPlan = "free" | "premium"

// ---- users ----
// Shared user domain types — single source of truth for the admin Manage
// Users page (`dashboard/admin/users`) and the profile settings forms.
//
// Roles match the better-auth `role` additionalField configured in
// `lib/auth.ts` (["customer", "vendor", "admin"]).


/** Role pill labels + palette. */
export const ROLE_META: Record<UserRole, { label: string; color: string }> = {
    customer: { label: "Customer", color: "#A1A4AA" },
    vendor: { label: "Vendor", color: "#F2A3B6" },
    admin: { label: "Admin", color: "#D8B26E" },
}

/** All roles, in privilege order. */
export const USER_ROLES = Object.keys(ROLE_META) as UserRole[]

// One user as returned by the Express API (`publicUser`).
export type UserRow = {
    _id: string
    name: string
    email: string
    image: string | null
    role: UserRole
    isBlocked: boolean
    businessName: string
    subscriptionPlan: SubscriptionPlan
    /** ISO timestamp, only set while the vendor is Premium. */
    subscriptionExpiresAt: string | null
    createdAt: string
}

// ---- services ----
// Shared service domain types + option lists — single source of truth for the
// add/edit service form (`dashboard/vendor/services`), the public Browse
// Services page and the admin Manage Services table.


export type ServiceStatus = "pending" | "approved" | "rejected"

export const SERVICE_CATEGORIES = [
    "Photography & Videography",
    "Wedding Venues",
    "Decoration & Florist",
    "Catering Services",
    "Makeup & Styling",
    "Wedding Fashion",
] as const

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number]

/** Approval status pill labels + palette. */
export const SERVICE_STATUS_META: Record<ServiceStatus, { label: string; color: string }> = {
    pending: { label: "Pending", color: "#F59E0B" },
    approved: { label: "Approved", color: "#22C55E" },
    rejected: { label: "Rejected", color: "#EF4444" },
}

export const SERVICE_STATUSES = Object.keys(SERVICE_STATUS_META) as ServiceStatus[]

export const MAX_SERVICE_IMAGES = 5

// Payload sent to POST /services and PATCH /services/:id.
export type ServiceFormData = {
    serviceName: string
    category: ServiceCategory
    description: string
    price: number
    location: string
    /** ImgBB urls, the first one is the cover. */
    images: string[]
}

export type VendorInfo = {
    _id: string
    name?: string
    image?: string | null
    businessName?: string
    email?: string
    subscriptionPlan?: SubscriptionPlan
    subscriptionExpiresAt?: string | null
}

// Saved document: payload + the fields set by the server.
export type ServiceRow = ServiceFormData & {
    _id: string
    vendorId: string
    status: ServiceStatus
    /** Vendor controlled availability switch. */
    isActive: boolean
    createdAt: string
    vendor?: VendorInfo
}

export type CategoryCount = { name: string; count: number }

// ---- bookings ----
// Shared booking domain types — used by the service details booking form,
// the customer My Bookings page and the vendor Booking Requests table.


export type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled"

/** Booking status pill labels + palette. */
export const BOOKING_STATUS_META: Record<BookingStatus, { label: string; color: string }> = {
    pending: { label: "Pending", color: "#F59E0B" },
    accepted: { label: "Accepted", color: "#22C55E" },
    rejected: { label: "Rejected", color: "#EF4444" },
    cancelled: { label: "Cancelled", color: "#A1A4AA" },
}

// Payload sent to POST /bookings. Customer and vendor are resolved on the server.
export type BookingFormData = {
    serviceId: string
    /** "YYYY-MM-DD" */
    eventDate: string
    eventLocation: string
    message: string
}

export type BookingRow = BookingFormData & {
    _id: string
    vendorId: string
    customerId: string
    status: BookingStatus
    createdAt: string
    service?: Pick<ServiceRow, "_id" | "serviceName" | "images" | "price" | "location" | "category">
    vendor?: VendorInfo
    customer?: { _id: string; name?: string; image?: string | null; email?: string }
}

// ---- transactions ----
// Transaction types — payment records are written by the Stripe webhook only,
// the admin Transactions page just reads them.

export type TransactionStatus = "paid" | "failed" | "refunded"

export type TransactionRow = {
    _id: string
    vendorId: string
    plan: "premium"
    amount: number
    currency: string
    stripeSessionId: string
    stripeSubscriptionId: string | null
    status: TransactionStatus
    createdAt: string
    vendor?: { _id: string; name?: string; email?: string; businessName?: string }
}

// ---- stats ----
// Dashboard overview numbers returned by the /stats/* endpoints.


export type VendorStats = {
    totalServices: number
    activeServices: number
    pendingBookings: number
    acceptedBookings: number
    subscriptionPlan: SubscriptionPlan
}

export type CustomerStats = {
    total: number
    pending: number
    accepted: number
    rejected: number
}

export type AdminStats = {
    totalUsers: number
    totalVendors: number
    totalCustomers: number
    totalServices: number
    pendingServices: number
    totalTransactions: number
}

// ---- api ----
// Result shape of every mutation (server action) so forms can toast the
// server's own message on both success and failure.
export type ActionResult<T = Record<string, unknown>> = {
    ok: boolean
    message?: string
} & T