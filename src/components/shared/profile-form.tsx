"use client"

// Profile settings for every role: name, profile image (ImgBB) and, for
// vendors, the business name. Role, plan and email are shown read-only, the
// API ignores them even if someone sends them.

import * as React from "react"
import { Loader2, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/shared/field"
import { RolePill } from "@/components/shared/role-pill"
import { UserAvatar } from "@/components/shared/user-avatar"
import { toast } from "@/components/ui/toast"
import { updateProfile } from "@/lib/api"
import { uploadImage } from "@/lib/api"
import { useSession } from "@/lib/auth-client"
import type { UserRow } from "@/lib/types"

export function ProfileForm({ user }: { user: UserRow }) {
    const { refetch } = useSession()
    const [name, setName] = React.useState(user.name)
    const [businessName, setBusinessName] = React.useState(user.businessName)
    const [image, setImage] = React.useState(user.image ?? "")
    const [uploading, setUploading] = React.useState(false)
    const [saving, setSaving] = React.useState(false)

    const handleImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        event.target.value = ""
        if (!file) return

        const formData = new FormData()
        formData.append("image", file)

        setUploading(true)
        const result = await uploadImage(formData)
        setUploading(false)

        if (!result.url) {
            toast.add({
                type: "error",
                title: "Image upload failed",
                description: result.error ?? "Please try another image.",
            })
            return
        }
        setImage(result.url)
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSaving(true)

        const result = await updateProfile({
            name,
            image,
            ...(user.role === "vendor" ? { businessName } : {}),
        })
        setSaving(false)

        if (!result.ok) {
            toast.add({
                type: "error",
                title: "Could not update profile",
                description: result.message ?? "Please check the form and try again.",
            })
            return
        }

        // Refresh the session so the navbar and sidebar show the new name/photo.
        await refetch()
        toast.add({ type: "success", title: "Profile updated", description: "Your changes have been saved." })
    }

    return (
        <form onSubmit={handleSubmit} className="surface-card flex flex-col gap-6 p-6">
            <div className="flex items-center gap-4">
                <UserAvatar src={image || null} name={name} className="size-20" />
                <div className="flex flex-col gap-2">
                    <label className="flex h-10 w-fit cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-[#1A1A1F] px-4 text-sm text-[#EDEDEF]/80 transition-colors hover:border-white/25 hover:text-white">
                        {uploading ? (
                            <Loader2 aria-hidden className="size-4 animate-spin" />
                        ) : (
                            <Upload aria-hidden className="size-4" />
                        )}
                        {uploading ? "Uploading…" : "Change photo"}
                        <input
                            type="file"
                            accept="image/*"
                            disabled={uploading}
                            onChange={handleImage}
                            className="sr-only"
                        />
                    </label>
                    {image ? (
                        <button
                            type="button"
                            onClick={() => setImage("")}
                            className="w-fit text-xs text-white/50 transition-colors hover:text-white"
                        >
                            Remove photo
                        </button>
                    ) : null}
                </div>
            </div>

            <Field label="Full name" htmlFor="name" required>
                <Input
                    id="name"
                    required
                    minLength={2}
                    maxLength={80}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="surface-field h-11"
                />
            </Field>

            {user.role === "vendor" ? (
                <Field label="Business name" htmlFor="businessName" hint="Shown to customers on your services">
                    <Input
                        id="businessName"
                        maxLength={80}
                        value={businessName}
                        onChange={(event) => setBusinessName(event.target.value)}
                        placeholder="e.g. Golden Hour Studio"
                        className="surface-field h-11"
                    />
                </Field>
            ) : null}

            <Field label="Email" htmlFor="email" hint="Your email cannot be changed here">
                <Input id="email" value={user.email} readOnly disabled className="surface-field h-11" />
            </Field>

            <div className="flex items-center gap-3 text-sm text-white/60">
                Account role <RolePill role={user.role} />
            </div>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={saving || uploading}
                    className="btn-brand h-11 px-6 text-white"
                >
                    {saving ? <Loader2 aria-hidden className="animate-spin" /> : null}
                    {saving ? "Saving…" : "Save changes"}
                </Button>
            </div>
        </form>
    )
}