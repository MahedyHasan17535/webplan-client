"use client"

import * as React from "react"
import { AuthForm, AuthFormData } from "@/components/auth-form"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import { useRouter, useSearchParams } from "next/navigation"

// Only follow same-site paths so `redirectTo` cannot bounce users elsewhere.
const safeRedirect = (value: string | null) =>
    value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard"

export default function SignInContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    // `/dashboard` redirects to the dashboard of the signed-in user's role.
    const redirectTo = safeRedirect(searchParams.get("redirectTo"))
    const [error, setError] = React.useState<string | null>(null)

    const handleSignIn = async (data: AuthFormData) => {
        setError(null)

        const { error: signInError } = await authClient.signIn.email({
            email: data.email,
            password: data.password,
            rememberMe: true,
        })

        if (signInError) {
            const message = signInError.message || "Invalid email or password"
            setError(message)
            toast.add({ type: "error", title: "Sign in failed", description: message })
            return
        }

        toast.add({ type: "success", title: "Welcome back!", description: "You are now signed in." })
        // Refresh so server components pick up the new session cookie, then navigate.
        router.refresh()
        router.push(redirectTo)
    }

    const handleGoogle = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: redirectTo,
        })
    }

    return <AuthForm mode="signin" onSubmit={handleSignIn} onGoogle={handleGoogle} error={error} />
}