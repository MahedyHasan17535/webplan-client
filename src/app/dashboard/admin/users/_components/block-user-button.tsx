"use client"

import { useRouter } from "next/navigation"
import { Ban, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { toast } from "@/components/ui/toast"
import { updateUserBlocked } from "@/lib/api"
import type { UserRow } from "@/lib/types"

// Block / unblock with confirmation. Blocked users lose access to every
// protected route and API immediately (their sessions are ended).
export function BlockUserButton({ user }: { user: UserRow }) {
    const router = useRouter()

    if (user.role === "admin") {
        return <span className="text-xs text-white/30">Protected</span>
    }

    const handleConfirm = async () => {
        const result = await updateUserBlocked(user._id, !user.isBlocked)
        if (!result.ok) {
            toast.add({
                type: "error",
                title: "Could not update user",
                description: result.message ?? "Please try again.",
            })
            return
        }
        toast.add({
            type: "success",
            title: user.isBlocked ? "User unblocked" : "User blocked",
            description: user.name,
        })
        router.refresh()
    }

    return (
        <ConfirmDialog
            trigger={
                <Button variant={user.isBlocked ? "outline" : "destructive"} size="sm" className="gap-1">
                    {user.isBlocked ? <ShieldCheck aria-hidden /> : <Ban aria-hidden />}
                    {user.isBlocked ? "Unblock" : "Block"}
                </Button>
            }
            title={user.isBlocked ? `Unblock ${user.name}?` : `Block ${user.name}?`}
            description={
                user.isBlocked
                    ? "They will be able to sign in and use the platform again."
                    : "They will be signed out and cannot use protected features until unblocked."
            }
            confirmLabel={user.isBlocked ? "Unblock" : "Block"}
            destructive={!user.isBlocked}
            onConfirm={handleConfirm}
        />
    )
}