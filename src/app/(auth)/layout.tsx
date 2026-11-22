import type { ReactNode } from "react"

import { WedPlanLogo } from "@/components/site-navbar"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-svh overflow-hidden bg-[#010103] text-white">
      {/* Ambient rose glow behind the card */}
      <div
        aria-hidden
        className="wedding-glow absolute top-1/2 left-1/2 h-[560px] w-[min(980px,150vw)] max-w-none -translate-x-1/2 -translate-y-1/2"
      />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-lg flex-col items-center px-4 py-6 sm:px-6">
        <WedPlanLogo />

        <main className="mt-10 flex w-full flex-1 flex-col justify-center pb-10 sm:justify-start">
          {children}
        </main>
      </div>
    </div>
  )
}