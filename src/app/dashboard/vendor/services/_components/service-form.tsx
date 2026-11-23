"use client"
import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ImagePlus, Loader2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field } from "@/components/shared/field"
import { SectionCard } from "@/components/dashboard/page-shell"
import { ServiceImage } from "@/components/shared/service-image"
import { toast } from "@/components/ui/toast"
import { uploadImage } from "@/lib/api"
import { createService, updateService } from "@/lib/api"
import {
    MAX_SERVICE_IMAGES,
    SERVICE_CATEGORIES,
    type ServiceCategory,
    type ServiceRow,
} from "@/lib/types"

const selectClass =
    "surface-field h-11 w-full rounded-lg border px-3 text-sm text-[#EDEDEF] outline-none"

export function ServiceForm({ service }: { service?: ServiceRow }) {
    const router = useRouter()
    const isEdit = Boolean(service)

    const [values, setValues] = React.useState({
        serviceName: service?.serviceName ?? "",
        category: (service?.category ?? "") as ServiceCategory | "",
        description: service?.description ?? "",
        price: service ? String(service.price) : "",
        location: service?.location ?? "",
    })
    const [images, setImages] = React.useState<string[]>(service?.images ?? [])
    const [uploading, setUploading] = React.useState(false)
    const [submitting, setSubmitting] = React.useState(false)
    const [limitReached, setLimitReached] = React.useState(false)

    const setField =
        (field: keyof typeof values) =>
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
            setValues((prev) => ({ ...prev, [field]: event.target.value }))

    const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? [])
        event.target.value = ""
        if (files.length === 0) return

        const room = MAX_SERVICE_IMAGES - images.length
        if (files.length > room) {
            toast.add({
                type: "warning",
                title: "Too many images",
                description: `You can add up to ${MAX_SERVICE_IMAGES} images per service.`,
            })
        }

        setUploading(true)
        for (const file of files.slice(0, room)) {
            const formData = new FormData()
            formData.append("image", file)
            const result = await uploadImage(formData)
            if (result.url) {
                const url = result.url
                setImages((prev) => [...prev, url])
            } else {
                toast.add({
                    type: "error",
                    title: "Image upload failed",
                    description: result.error ?? "Please try another image.",
                })
            }
        }
        setUploading(false)
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLimitReached(false)

        const price = Number(values.price)
        if (!values.category) {
            toast.add({ type: "error", title: "Missing category", description: "Please select a category." })
            return
        }
        if (!Number.isFinite(price) || price <= 0) {
            toast.add({ type: "error", title: "Invalid price", description: "Price must be greater than 0." })
            return
        }
        if (images.length === 0) {
            toast.add({ type: "error", title: "Missing image", description: "Upload at least one service image." })
            return
        }

        const payload = {
            serviceName: values.serviceName.trim(),
            category: values.category,
            description: values.description.trim(),
            price,
            location: values.location.trim(),
            images,
        }

        setSubmitting(true)
        const result = service
            ? await updateService(service._id, payload)
            : await createService(payload)
        setSubmitting(false)

        if (!result.ok) {
            setLimitReached(/upgrade to premium/i.test(result.message ?? ""))
            toast.add({
                type: "error",
                title: isEdit ? "Could not update service" : "Could not add service",
                description: result.message ?? "Please check the form and try again.",
            })
            return
        }

        toast.add({
            type: "success",
            title: isEdit ? "Service updated" : "Service submitted",
            description: isEdit
                ? "Your changes have been saved."
                : "It will appear publicly once an admin approves it.",
        })
        router.push("/dashboard/vendor/services")
        router.refresh()
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <SectionCard index={1} title="Service details">
                <Field label="Service name" htmlFor="serviceName" required>
                    <Input
                        id="serviceName"
                        required
                        minLength={3}
                        maxLength={100}
                        value={values.serviceName}
                        onChange={setField("serviceName")}
                        placeholder="e.g. Golden Hour Wedding Photography"
                        className="surface-field h-11"
                    />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Service category" htmlFor="category" required>
                        <select
                            id="category"
                            required
                            value={values.category}
                            onChange={setField("category")}
                            className={selectClass}
                        >
                            <option value="" className="bg-[#1A1A1F]">Select a category</option>
                            {SERVICE_CATEGORIES.map((category) => (
                                <option key={category} value={category} className="bg-[#1A1A1F]">
                                    {category}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Price (USD)" htmlFor="price" required>
                        <Input
                            id="price"
                            type="number"
                            required
                            min={1}
                            step="1"
                            value={values.price}
                            onChange={setField("price")}
                            placeholder="1500"
                            className="surface-field h-11"
                        />
                    </Field>
                </div>

                <Field label="Location" htmlFor="location" required>
                    <Input
                        id="location"
                        required
                        minLength={2}
                        value={values.location}
                        onChange={setField("location")}
                        placeholder="City or area you serve"
                        className="surface-field h-11"
                    />
                </Field>

                <Field label="Description" htmlFor="description" required hint="At least 20 characters">
                    <Textarea
                        id="description"
                        required
                        minLength={20}
                        rows={6}
                        value={values.description}
                        onChange={setField("description")}
                        placeholder="Describe what is included, your style and experience"
                        className="surface-field"
                    />
                </Field>
            </SectionCard>

            <SectionCard index={2} title="Service images">
                <p className="text-sm text-white/60">
                    Upload 1 to {MAX_SERVICE_IMAGES} images (max 4 MB each). The first one is the cover.
                </p>

                <ul className="grid list-none grid-cols-2 gap-3 sm:grid-cols-3">
                    {images.map((image, index) => (
                        <li key={image} className="relative">
                            <ServiceImage
                                src={image}
                                alt={`Service image ${index + 1}`}
                                className="aspect-[4/3] w-full rounded-lg border border-white/10"
                            />
                            {index === 0 ? (
                                <span className="gold-chip absolute top-2 left-2 rounded-full px-2 py-0.5 text-[11px]">
                                    Cover
                                </span>
                            ) : null}
                            <button
                                type="button"
                                aria-label={`Remove image ${index + 1}`}
                                onClick={() => setImages((prev) => prev.filter((url) => url !== image))}
                                className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white transition-colors hover:bg-destructive"
                            >
                                <Trash2 aria-hidden className="size-3.5" />
                            </button>
                        </li>
                    ))}

                    {images.length < MAX_SERVICE_IMAGES ? (
                        <li>
                            <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 bg-[#1A1A1F] text-sm text-white/60 transition-colors hover:border-brand/60 hover:text-white">
                                {uploading ? (
                                    <Loader2 aria-hidden className="size-6 animate-spin" />
                                ) : (
                                    <ImagePlus aria-hidden className="size-6" />
                                )}
                                {uploading ? "Uploading…" : "Add images"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    disabled={uploading}
                                    onChange={handleFiles}
                                    className="sr-only"
                                />
                            </label>
                        </li>
                    ) : null}
                </ul>
            </SectionCard>

            {limitReached ? (
                <p role="alert" className="rounded-lg border border-[#D8B26E]/40 bg-[#D8B26E]/10 px-4 py-3 text-sm text-[#D8B26E]">
                    You reached the free plan limit.{" "}
                    <Link href="/dashboard/vendor/subscription" className="font-semibold underline">
                        Upgrade to Premium
                    </Link>{" "}
                    to publish more services.
                </p>
            ) : null}

            <div className="flex justify-end gap-3">
                <Button
                    render={<Link href="/dashboard/vendor/services" />}
                    nativeButton={false}
                    variant="outline"
                    className="h-11 px-6"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={submitting || uploading}
                    className="btn-brand h-11 px-6 text-white"
                >
                    {submitting ? <Loader2 aria-hidden className="animate-spin" /> : null}
                    {submitting ? "Saving…" : isEdit ? "Save changes" : "Submit for approval"}
                </Button>
            </div>
        </form>
    )
}