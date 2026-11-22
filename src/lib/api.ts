// All calls to the Express API and server actions live in this one file.
// 'use server' lets client components call these functions directly, while the
// fetch (and the secret session token) always stays on the server.
'use server'
import type {
    ActionResult,
    AdminStats,
    BookingFormData,
    BookingRow,
    CategoryCount,
    CustomerStats,
    ServiceFormData,
    ServiceRow,
    ServiceStatus,
    TransactionRow,
    UserRow,
    VendorStats,
} from "@/lib/types"
import { authFetch, protectedMutation, toResult } from "@/lib/server"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// ===== services (data access) =====
// Single data-access module for the services API (Express on :5000):
// public reads, vendor CRUD and admin moderation.


// GET /services?search=&category=&location=&sort= — approved + active only.
export const getServices = async (query = ''): Promise<ServiceRow[]> => {
    try {
        const res = await fetch(`${BASE_URL}/services?${query}`, { cache: "no-store" })
        if (!res.ok) return []
        return res.json()
    } catch (error) {
        console.error("Failed to load services:", error)
        return []
    }
}

export const getServiceCategories = async (): Promise<CategoryCount[]> => {
    try {
        const res = await fetch(`${BASE_URL}/services/categories`, { cache: "no-store" })
        if (!res.ok) return []
        return res.json()
    } catch (error) {
        console.error("Failed to load categories:", error)
        return []
    }
}

// Private: the details page needs a signed-in user. Returns null for an
// invalid id or a missing service so the page can show its error state.
export const getServiceById = async (serviceId: string): Promise<ServiceRow | null> => {
    const res = await authFetch(`${BASE_URL}/services/${serviceId}`)
    if (!res.ok) return null
    return res.json()
}

export const getMyServices = async (): Promise<ServiceRow[]> => {
    const res = await authFetch(`${BASE_URL}/services/mine`)
    return res.json()
}

export const getAdminServices = async (query = ''): Promise<ServiceRow[]> => {
    const res = await authFetch(`${BASE_URL}/admin/services?${query}`)
    return res.json()
}

export const createService = async (data: ServiceFormData): Promise<ActionResult> => {
    const res = await protectedMutation(`${BASE_URL}/services`, "POST", data)
    return toResult(res)
}

export const updateService = async (serviceId: string, data: ServiceFormData): Promise<ActionResult> => {
    const res = await protectedMutation(`${BASE_URL}/services/${serviceId}`, "PATCH", data)
    return toResult(res)
}

export const setServiceAvailability = async (serviceId: string, isActive: boolean): Promise<ActionResult> => {
    const res = await protectedMutation(`${BASE_URL}/services/${serviceId}/availability`, "PATCH", { isActive })
    return toResult(res)
}

export const deleteService = async (serviceId: string): Promise<ActionResult> => {
    const res = await protectedMutation(`${BASE_URL}/services/${serviceId}`, "DELETE")
    return toResult(res)
}

export const updateServiceStatus = async (serviceId: string, status: ServiceStatus): Promise<ActionResult> => {
    const res = await protectedMutation(`${BASE_URL}/admin/services/${serviceId}/status`, "PATCH", { status })
    return toResult(res)
}

// ===== bookings (data access) =====
// Data-access module for the bookings API (Express on :5000).
// Follows the same pattern as the services functions above.


export const getMyBookings = async (): Promise<BookingRow[]> => {
    const res = await authFetch(`${BASE_URL}/bookings/mine`)
    return res.json()
}

export const getVendorBookings = async (): Promise<BookingRow[]> => {
    const res = await authFetch(`${BASE_URL}/bookings/vendor`)
    return res.json()
}

export const getBookingById = async (bookingId: string): Promise<BookingRow | null> => {
    const res = await authFetch(`${BASE_URL}/bookings/${bookingId}`)
    if (!res.ok) return null
    return res.json()
}

export const createBooking = async (data: BookingFormData): Promise<ActionResult> => {
    const res = await protectedMutation(`${BASE_URL}/bookings`, "POST", data)
    return toResult(res)
}

// Vendor: only a pending request can be accepted or rejected.
export const updateBookingStatus = async (
    bookingId: string,
    status: "accepted" | "rejected"
): Promise<ActionResult> => {
    const res = await protectedMutation(`${BASE_URL}/bookings/${bookingId}/status`, "PATCH", { status })
    return toResult(res)
}

// Customer: only a pending request can be cancelled.
export const cancelBooking = async (bookingId: string): Promise<ActionResult> => {
    const res = await protectedMutation(`${BASE_URL}/bookings/${bookingId}/cancel`, "PATCH")
    return toResult(res)
}

// ===== user (data access) =====
export const getUsers = async (query = ''): Promise<UserRow[]> => {
    const res = await authFetch(`${BASE_URL}/users?${query}`)
    return res.json()
}

export const getUserById = async (userId: string): Promise<UserRow | null> => {
    const res = await authFetch(`${BASE_URL}/users/${userId}`)
    if (!res.ok) return null
    return res.json()
}

// The Express API is the source of truth for plan + expiry (Better Auth's
// session can lag behind a webhook activation).
export const getCurrentUser = async (): Promise<UserRow> => {
    const res = await authFetch(`${BASE_URL}/users/me`)
    return res.json()
}

// ===== stats (data access) =====
// Dashboard overview numbers (Express /stats/*).


export const getVendorStats = async (): Promise<VendorStats> => {
    const res = await authFetch(`${BASE_URL}/stats/vendor`)
    return res.json()
}

export const getCustomerStats = async (): Promise<CustomerStats> => {
    const res = await authFetch(`${BASE_URL}/stats/customer`)
    return res.json()
}

export const getAdminStats = async (): Promise<AdminStats> => {
    const res = await authFetch(`${BASE_URL}/stats/admin`)
    return res.json()
}

// ===== transactions (data access) =====
// Read-only transactions (payment records are created by the Stripe webhook).


export const getTransactions = async (): Promise<TransactionRow[]> => {
    const res = await authFetch(`${BASE_URL}/transactions`)
    return res.json()
}

export const getMyTransactions = async (): Promise<TransactionRow[]> => {
    const res = await authFetch(`${BASE_URL}/transactions/mine`)
    return res.json()
}

// ===== users (actions) =====
// Admin: block or unblock a user.
export const updateUserBlocked = async (userId: string, isBlocked: boolean): Promise<ActionResult> => {
    const api = `${BASE_URL}/users/${userId}/block`;
    const response = await protectedMutation(api, "PATCH", { isBlocked })
    return toResult(response)
}

// Name, image and businessName only — the API ignores role/plan fields.
export const updateProfile = async (data: {
    name: string
    image: string
    businessName?: string
}): Promise<ActionResult<{ user?: UserRow }>> => {
    const response = await protectedMutation(`${BASE_URL}/users/me`, "PATCH", data)
    return toResult(response)
}

// ===== payments (actions) =====
// Vendor: the Express API creates the Stripe Checkout Session for the
// verified vendor and returns the hosted page url.
export const createCheckoutSession = async (): Promise<ActionResult<{ url?: string }>> => {
    const response = await protectedMutation(`${BASE_URL}/payments/create-checkout-session`, "POST")
    return toResult(response)
}

// The success page only *reports* the payment. Premium is activated by the
// verified Stripe webhook, never by this redirect.
export const getPaymentStatus = async (
    sessionId: string
): Promise<{ status: "pending" | "paid"; amount?: number; currency?: string }> => {
    const res = await authFetch(`${BASE_URL}/payments/status?session_id=${encodeURIComponent(sessionId)}`)
    if (!res.ok) return { status: "pending" }
    return res.json()
}

// ===== upload (actions) =====
const MAX_IMAGE_BYTES = 4 * 1024 * 1024

// Uploads one image to ImgBB. The API key stays on the server (IMGBB_API_KEY).
export const uploadImage = async (formData: FormData): Promise<{ url?: string; error?: string }> => {
    const file = formData.get("image")
    if (!(file instanceof File) || file.size === 0) {
        return { error: "Please choose an image" }
    }
    if (!file.type.startsWith("image/")) {
        return { error: "Only image files can be uploaded" }
    }
    if (file.size > MAX_IMAGE_BYTES) {
        return { error: "Image must be smaller than 4 MB" }
    }

    const key = process.env.IMGBB_API_KEY
    if (!key) {
        return { error: "Image upload is not configured" }
    }

    const body = new FormData()
    body.append("image", file)

    try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
            method: "POST",
            body,
        })
        const result = await res.json()
        if (!res.ok || !result?.data?.url) {
            return { error: result?.error?.message || "Image upload failed" }
        }
        return { url: result.data.url as string }
    } catch {
        return { error: "Image upload failed" }
    }
}