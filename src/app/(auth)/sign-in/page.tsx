import { Suspense } from "react"
import SignInContent from "./SignInContent"

export const metadata = { title: "Sign In" }

export default function SignInPage() {
    return (
        <Suspense fallback={<div className="text-center text-white/60">Loading sign in...</div>}>
            <SignInContent />
        </Suspense>
    )
}