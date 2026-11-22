"use client"

import * as React from "react"
import Link from "next/link"
import { Eye, EyeOff, Loader2, Lock, Mail, Store, Trash2, Upload, User, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { PillGroup } from "@/components/shared/pill-group"
import { toast } from "@/components/ui/toast"
import { uploadImage } from "@/lib/api"
import type { UserRole } from "@/lib/types"

export type AuthMode = "signin" | "signup"

export type AuthFormData = {
  email: string
  password: string
  name?: string
  /** Only "customer" or "vendor" can be picked; admin is never offered. */
  role?: Exclude<UserRole, "admin">
  /** ImgBB url of the uploaded profile image (optional). */
  image?: string
}

const COPY = {
  signin: {
    title: "Welcome back",
    subtitle: "Sign in to manage your wedding plans.",
    submitLabel: "Sign In",
    showName: false,
    footer: "New to WedPlan?",
    footerLinkHref: "/sign-up",
    footerLinkLabel: "Create an account",
  },
  signup: {
    title: "Create your account",
    subtitle: "Plan your big day, or grow your wedding business.",
    submitLabel: "Sign Up",
    showName: true,
    footer: "Already have an account?",
    footerLinkHref: "/sign-in",
    footerLinkLabel: "Sign in",
  },
} as const

const inputClass =
  "h-12 w-full rounded-lg border surface-field pl-10 pr-3 text-base tracking-[-0.0125rem] text-[#EDEDEF] shadow-[inset_0_3px_10px_rgba(255,255,255,0.04)] outline-none transition-colors placeholder:text-white/60 focus:ring-2 focus:ring-brand/30"
const labelClass = "mb-2 block text-left text-sm text-[#EDEDEF]/80"

// Sign-up role picker — values match better-auth's `role` field in lib/auth.ts.
// Admin is intentionally not offered at sign-up; it's granted on the server.
const ROLES: {
  value: Exclude<UserRole, "admin">
  label: string
  icon: React.ComponentType<{ className?: string }>
}[] = [
  { value: "customer", label: "Customer", icon: Users },
  { value: "vendor", label: "Vendor", icon: Store },
]

// 6+ characters, one uppercase and one lowercase letter (mirrors lib/auth.ts).
export const getPasswordError = (password: string) => {
  if (password.length < 6) return "Password must be at least 6 characters"
  if (!/[A-Z]/.test(password)) return "Password needs at least one uppercase letter"
  if (!/[a-z]/.test(password)) return "Password needs at least one lowercase letter"
  return null
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 48 48" className={className}>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.800 2.400 30.300 0 24 0 14.600 0 6.500 5.400 2.600 13.200l7.900 6.100C12.400 13.600 17.700 9.500 24 9.500z" />
      <path fill="#4285F4" d="M46.500 24.500c0-1.600-.1-3.100-.4-4.500H24v9h12.700c-.6 3-2.200 5.500-4.700 7.200l7.300 5.700c4.300-4 7.200-9.900 7.200-17.400z" />
      <path fill="#FBBC05" d="M10.500 28.700c-.5-1.400-.8-3-.8-4.700s.3-3.200.8-4.700l-7.900-6.100C.9 16.400 0 20.100 0 24s.9 7.600 2.600 10.800l7.900-6.100z" />
      <path fill="#34A853" d="M24 48c6.500 0 11.900-2.100 15.900-5.800l-7.300-5.700c-2 1.400-4.700 2.300-8.600 2.300-6.300 0-11.600-4.100-13.500-9.800l-7.900 6.100C6.500 42.600 14.600 48 24 48z" />
    </svg>
  )
}

export function AuthForm({
  mode,
  onSubmit,
  onGoogle,
  error,
}: {
  mode: AuthMode
  /** Called with the collected form values when the form is submitted. */
  onSubmit?: (data: AuthFormData) => Promise<void> | void
  /** Starts the Google OAuth flow. */
  onGoogle?: () => Promise<void> | void
  /** Shown under the submit button, e.g. an auth API error message. */
  error?: string | null
}) {
  const copy = COPY[mode]
  const isSignup = mode === "signup"

  const [values, setValues] = React.useState<AuthFormData>({
    email: "",
    password: "",
    name: "",
    role: "customer",
    image: undefined,
  })
  const [showPassword, setShowPassword] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const [passwordError, setPasswordError] = React.useState<string | null>(null)
  /** Object URL preview of the chosen image (revoked on replace/remove). */
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)

  // Uploads the chosen file to ImgBB (through a server action, so the API key
  // never reaches the browser) and stores the returned url on the form values.
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(file ? URL.createObjectURL(file) : null)

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
      setImagePreview(null)
      return
    }
    const imageURL = result.url
    setValues((prev) => ({ ...prev, image: imageURL }))
  }

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(null)
    setValues((prev) => ({ ...prev, image: undefined }))
  }

  const setField =
    (field: keyof AuthFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setValues((prev) => ({ ...prev, [field]: event.target.value }))

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSignup) {
      const message = getPasswordError(values.password)
      setPasswordError(message)
      if (message) return
    }
    if (uploading) {
      toast.add({ type: "info", title: "Please wait", description: "Your image is still uploading." })
      return
    }

    const data: AuthFormData = {
      email: values.email,
      password: values.password,
      ...(isSignup
        ? { name: values.name, role: values.role, image: values.image }
        : {}),
    }

    setSubmitting(true)
    try {
      await onSubmit?.(data)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="surface-card w-full p-8">
      <div className="mb-8 flex flex-col gap-2 text-center">
        <h1 className="page-title">
          {copy.title}
        </h1>
        <p className="text-base leading-[1.6] text-white/70">{copy.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {copy.showName ? (
          <fieldset>
            <legend className={labelClass}>Joining WedPlan as</legend>
            <PillGroup
              name="role"
              value={values.role ?? "customer"}
              onChange={(role) => setValues((prev) => ({ ...prev, role }))}
              options={ROLES}
              className="grid grid-cols-2 gap-2"
              pillClassName="flex-col h-full w-full justify-center gap-1.5 px-2 py-3 tracking-[-0.0125rem]"
            />
          </fieldset>
        ) : null}

        {copy.showName ? (
          <fieldset>
            <legend className={labelClass}>Profile photo (optional)</legend>
            <div className="flex items-center gap-3">
              {/* Preview once an image is picked, default icon otherwise. */}
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="Selected profile photo preview"
                  className="size-12 shrink-0 rounded-full border border-white/10 object-cover"
                />
              ) : (
                <span
                  aria-hidden
                  className="flex size-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#1A1A1F]"
                >
                  <User className="size-5 text-white/50" />
                </span>
              )}

              <label className="flex h-11 cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-[#1A1A1F] px-4 text-sm text-[#EDEDEF]/80 transition-colors hover:border-white/25 hover:text-white">
                {uploading ? (
                  <Loader2 aria-hidden className="size-4 animate-spin" />
                ) : (
                  <Upload aria-hidden className="size-4" />
                )}
                {uploading ? "Uploading…" : values.image ? "Change image" : "Upload image"}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={uploading}
                  onChange={handleImageChange}
                />
              </label>

              {values.image ? (
                <>
                  <span className="min-w-0 flex-1 truncate text-sm text-white/60">
                    Uploaded
                  </span>
                  <button
                    type="button"
                    onClick={clearImage}
                    aria-label="Remove selected image"
                    className="rounded-md p-2 text-white/50 transition-colors hover:text-white"
                  >
                    <Trash2 aria-hidden className="size-4" />
                  </button>
                </>
              ) : null}
            </div>
          </fieldset>
        ) : null}

        {copy.showName ? (
          <div>
            <label htmlFor="name" className={labelClass}>
              Full name
            </label>
            <div className="relative">
              <User
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-white/50"
              />
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                minLength={2}
                maxLength={80}
                value={values.name ?? ""}
                onChange={setField("name")}
                placeholder="Jane Doe"
                className={inputClass}
              />
            </div>
          </div>
        ) : null}

        <div>
          <label htmlFor="email" className={labelClass}>
            Email address
          </label>
          <div className="relative">
            <Mail
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-white/50"
            />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={values.email}
              onChange={setField("email")}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <div className="relative">
            <Lock
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-white/50"
            />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isSignup ? "new-password" : "current-password"}
              required
              minLength={6}
              maxLength={72}
              value={values.password}
              onChange={setField("password")}
              aria-invalid={passwordError ? true : undefined}
              placeholder={isSignup ? "6+ chars, upper & lowercase" : "Your password"}
              className={cn(inputClass, "pr-11")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-white/50 transition-colors hover:text-white"
            >
              {showPassword ? (
                <EyeOff aria-hidden className="size-4" />
              ) : (
                <Eye aria-hidden className="size-4" />
              )}
            </button>
          </div>
          {passwordError ? (
            <p role="alert" className="mt-2 text-sm text-destructive">
              {passwordError}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={submitting || uploading}
          className="btn-brand mt-1 flex h-[52px] w-full items-center justify-center gap-2 rounded-[8px] text-lg font-medium text-[#EDEDEF] shadow-[inset_0_3px_10px_rgba(255,255,255,0.2)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 disabled:opacity-60"
        >
          {submitting ? <Loader2 aria-hidden className="size-5 animate-spin" /> : null}
          {submitting ? "Please wait…" : copy.submitLabel}
        </button>

        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </p>
        ) : null}
      </form>

      {onGoogle ? (
        <>
          <div className="my-6 flex items-center gap-4 text-xs text-white/40">
            <span aria-hidden className="h-px flex-1 bg-white/10" />
            or
            <span aria-hidden className="h-px flex-1 bg-white/10" />
          </div>

          <button
            type="button"
            onClick={() => onGoogle()}
            className="flex h-[52px] w-full items-center justify-center gap-3 rounded-[8px] border border-white/10 bg-[#1A1A1F] text-base font-medium text-[#EDEDEF] transition-colors hover:border-white/25"
          >
            <GoogleIcon className="size-5" />
            Continue with Google
          </button>
        </>
      ) : null}

      <p className="mt-8 text-center text-base text-white/70">
        {copy.footer}{" "}
        <Link
          href={copy.footerLinkHref}
          className="font-semibold text-brand-soft transition-colors hover:text-white"
        >
          {copy.footerLinkLabel}
        </Link>
      </p>
    </div>
  )
}