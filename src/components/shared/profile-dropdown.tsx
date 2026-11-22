"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown, LayoutDashboard, LogOut, Settings } from "lucide-react"

import { UserAvatar } from "@/components/shared/user-avatar"
import { RolePill } from "@/components/shared/role-pill"
import { signOut, useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

const itemClass =
    "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-[#EDEDEF]/90 transition-colors hover:bg-white/5 hover:text-white"

export function ProfileDropdown({ className }: { className?: string }) {
    const router = useRouter()
    const { data: session } = useSession()
    const [open, setOpen] = React.useState(false)
    const ref = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (!open) return

        function onPointerDown(event: MouseEvent) {
            if (!ref.current?.contains(event.target as Node)) setOpen(false)
        }
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") setOpen(false)
        }

        document.addEventListener("mousedown", onPointerDown)
        window.addEventListener("keydown", onKeyDown)
        return () => {
            document.removeEventListener("mousedown", onPointerDown)
            window.removeEventListener("keydown", onKeyDown)
        }
    }, [open])

    if (!session?.user) return null
    const { user } = session

    const handleLogout = async () => {
        setOpen(false)
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/")
                    router.refresh()
                },
            },
        })
    }

    return (
        <div ref={ref} className={cn("relative", className)}>
            <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((value) => !value)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-[#1A1A1F] py-1 pr-3 pl-1 transition-colors hover:border-white/25"
            >
                <UserAvatar src={user.image} name={user.name} className="size-8" />
                <span className="hidden max-w-32 truncate text-sm text-[#EDEDEF] sm:block">
                    {user.name}
                </span>
                <ChevronDown aria-hidden className="size-4 text-white/60" />
            </button>

            {open ? (
                <div
                    role="menu"
                    className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-white/10 bg-[#141418] p-2 shadow-xl"
                >
                    <div className="flex items-center gap-3 px-3 py-2.5">
                        <UserAvatar src={user.image} name={user.name} className="size-10" />
                        <div className="flex min-w-0 flex-col gap-1">
                            <span className="truncate text-sm font-medium text-[#EDEDEF]">
                                {user.name}
                            </span>
                            <RolePill role={user.role} />
                        </div>
                    </div>

                    <div aria-hidden className="my-1 h-px bg-white/10" />

                    <Link
                        role="menuitem"
                        href={`/dashboard/${user.role}`}
                        onClick={() => setOpen(false)}
                        className={itemClass}
                    >
                        <LayoutDashboard aria-hidden className="size-4" />
                        Dashboard
                    </Link>
                    <Link
                        role="menuitem"
                        href={`/dashboard/${user.role}/settings`}
                        onClick={() => setOpen(false)}
                        className={itemClass}
                    >
                        <Settings aria-hidden className="size-4" />
                        Profile Settings
                    </Link>
                    <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className={cn(itemClass, "text-[#F87171] hover:text-[#F87171]")}
                    >
                        <LogOut aria-hidden className="size-4" />
                        Logout
                    </button>
                </div>
            ) : null}
        </div>
    )
}