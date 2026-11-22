"use client"

import * as React from "react"

import { AuthForm, AuthFormData } from "@/components/auth-form"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import { useRouter } from 'next/navigation'

export default function SignUpPage() {

    const router = useRouter();
    const [error, setError] = React.useState<string | null>(null);

    const handleSignUp = async (data: AuthFormData) => {

        setError(null);

        const { error: signUpError } = await authClient.signUp.email({
            name: data.name as string,
            email: data.email,
            password: data.password,
            role: data.role, // "customer" | "vendor" — the server ignores anything else
            image: data.image,
        });

        if (signUpError) {
            // e.g. 422 "User already exists. Use another email."
            const message = signUpError.message || "Something went wrong. Please try again.";
            setError(message);
            toast.add({ type: "error", title: "Sign up failed", description: message });
            return;
        }

        toast.add({
            type: "success",
            title: "Account created",
            description: "Welcome to WedPlan!",
        });

        // Refresh so server components pick up the new session cookie, then go
        // to the dashboard that matches the chosen role.
        router.refresh();
        router.push("/dashboard");
    }

    const handleGoogle = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/dashboard",
        })
    }

    return <AuthForm mode="signup" onSubmit={handleSignUp} onGoogle={handleGoogle} error={error} />
}