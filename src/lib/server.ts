import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import type { UserRole } from "@/lib/types"
import type { ActionResult } from "@/lib/types"

export const getSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return session;
}

// Signed-out visitors go to Sign In and come back to `redirectTo` afterwards.
export const requireSession = async (redirectTo?: string) => {
    const session = await getSession();
    if (!session) {
        redirect(redirectTo ? `/sign-in?redirectTo=${encodeURIComponent(redirectTo)}` : "/sign-in");
    }
    if (session.user.isBlocked) {
        redirect("/unauthorized");
    }
    return session;
}

export const getToken = async () => {
    const session = await getSession();
    if (!session || !session.session?.token) {
        redirect("/sign-in");
    }
    return session.session.token;
}

export const authFetch = async (api: string) => {
    const token = await getToken();
    const res = await fetch(api, {
        cache: "no-store",
        headers: {
            authorization: `Bearer ${token}`
        }
    })
    if (res.status === 401) {
        redirect("/sign-in");
    }
    if (res.status === 403) {
        redirect("/unauthorized");
    }
    return res;
}


export const protectedMutation = async (api: string, method: string, data?: unknown) => {
    const token = await getToken();
    const res = await fetch(api, {
        method: method,
        cache: "no-store",
        headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${token}`
        },
        body: data ? JSON.stringify(data) : null
    })
    if (res.status === 401) {
        redirect("/sign-in");
    }
    if (res.status === 403) {
        redirect("/unauthorized");
    }
    return res;
}


// Layout level guard: wrong role -> /unauthorized, signed out -> /sign-in.
export const requireRole = async (role: UserRole) => {
    const session = await requireSession();
    if (session.user.role !== role) {
        redirect("/unauthorized");
    }
    return session;
}


// Turns an Express response into an ActionResult for forms and toasts.
export const toResult = async <T = Record<string, unknown>>(res: Response): Promise<ActionResult<T>> => {
    const data = await res.json().catch(() => ({}))
    return { ok: res.ok, ...data }
}