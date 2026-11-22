"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ProfileDropdown } from "@/components/shared/profile-dropdown"
import { useSession } from "@/lib/auth-client"

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
] as const

export function WedPlanLogo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="WedPlan home"
      className={cn(
        "flex shrink-0 items-center gap-2 font-heading text-2xl font-bold tracking-[-0.02em] text-white",
        className
      )}
    >
      <Heart aria-hidden className="size-6 fill-brand text-brand" />
      WedPlan
    </Link>
  )
}

export function SiteNavbar() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  // useSession is reactive: the navbar updates the moment someone signs in or out.
  const { data: session, isPending } = useSession()

  React.useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/")

  const linkClass = (active: boolean) =>
    cn(
      "text-base tracking-[-0.0125rem] transition-colors hover:text-white",
      active ? "font-bold text-[#EDEDEF] underline underline-offset-3" : "text-[#EDEDEF]/90"
    )

  return (
    <header className="sticky top-4 z-50 px-4 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
        <WedPlanLogo />

        {/* Desktop */}
        <nav
          aria-label="Main navigation"
          className="hidden h-[68px] items-center gap-6 rounded-lg border border-white/10 bg-[#1A1A1F]/95 px-6 backdrop-blur lg:flex"
        >
          <ul className="flex items-center gap-5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={linkClass(isActive(link.href))}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Separator */}
          <div aria-hidden className="h-px w-6 bg-[#A8A8A8]/40" />

          <div className="flex min-w-24 items-center gap-3">
            {isPending ? null : session?.user ? (
              <ProfileDropdown />
            ) : (
              <>
                <Button
                  render={<Link href="/sign-in" />}
                  nativeButton={false}
                  className="h-[38px] rounded-[8px] bg-transparent px-4 text-lg font-semibold text-brand-soft hover:bg-white/5 hover:text-brand-soft"
                >
                  Sign In
                </Button>
                <Button
                  render={<Link href="/sign-up" />}
                  nativeButton={false}
                  className="btn-brand h-[44px] rounded-[8px] px-6 text-lg font-medium text-[#EDEDEF] shadow-[inset_0_3px_10px_rgba(255,255,255,0.2)]"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile: profile dropdown (when signed in) + menu toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          {session?.user ? <ProfileDropdown /> : null}
          <Button
            variant="ghost"
            size="icon"
            aria-expanded={open}
            aria-controls="site-navbar-mobile"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
            className="size-11 rounded-lg border border-white/10 bg-[#1A1A1F] text-[#EDEDEF] hover:bg-white/5 hover:text-white"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile panel */}
      {open ? (
        <div
          id="site-navbar-mobile"
          className="mx-auto mt-3 flex max-w-7xl flex-col gap-2 rounded-lg border border-white/10 bg-[#1A1A1F] p-4 shadow-xl lg:hidden"
        >
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2 hover:bg-white/5",
                    linkClass(isActive(link.href))
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {session?.user ? null : (
            <>
              <div aria-hidden className="h-px w-full bg-[#A8A8A8]/40" />

              <div className="flex flex-col gap-2">
                <Button
                  render={<Link href="/sign-in" onClick={() => setOpen(false)} />}
                  nativeButton={false}
                  className="h-[44px] rounded-[8px] border border-white/10 bg-transparent px-4 text-lg font-semibold text-brand-soft hover:bg-white/5 hover:text-brand-soft"
                >
                  Sign In
                </Button>
                <Button
                  render={<Link href="/sign-up" onClick={() => setOpen(false)} />}
                  nativeButton={false}
                  className="btn-brand h-[52px] rounded-[8px] px-6 text-lg font-medium text-[#EDEDEF] shadow-[inset_0_3px_10px_rgba(255,255,255,0.2)]"
                >
                  Sign Up
                </Button>
              </div>
            </>
          )}
        </div>
      ) : null}
    </header>
  )
}