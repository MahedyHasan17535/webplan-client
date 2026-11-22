import { PageContainer } from "@/components/dashboard/page-shell"
import { Skeleton } from "@/components/ui/skeleton"

// Shown while any dashboard page is loading its data.
export default function DashboardLoading() {
    return (
        <PageContainer width="wide">
            <div aria-busy="true" aria-label="Loading dashboard" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-96 max-w-full" />
                </div>
                <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton key={index} className="h-28" />
                    ))}
                </div>
                <Skeleton className="h-72" />
            </div>
        </PageContainer>
    )
}