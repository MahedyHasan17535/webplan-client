import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SiteNavbar />
            <main className="min-h-[60vh]">{children}</main>
            <SiteFooter />
        </>
    )
}