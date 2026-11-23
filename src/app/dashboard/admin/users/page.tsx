import Link from "next/link"
import { Eye, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PageContainer, PageHeader } from "@/components/dashboard/page-shell"
import { EmptyState } from "@/components/shared/empty-state"
import { Pill } from "@/components/shared/pill"
import { RolePill } from "@/components/shared/role-pill"
import { UrlFilters } from "@/components/shared/url-filters"
import { UserAvatar } from "@/components/shared/user-avatar"
import { getUsers } from "@/lib/api"
import { formatTimestamp } from "@/lib/format"
import { ROLE_META, USER_ROLES } from "@/lib/types"
import { BlockUserButton } from "./_components/block-user-button"
import { Suspense } from "react"

export const metadata = { title: "Manage Users" }

export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const search = await searchParams
    const urlSearch = new URLSearchParams()
    for (const key of ["search", "role"]) {
        const value = search[key]
        if (typeof value === "string" && value) urlSearch.set(key, value)
    }

    const users = await getUsers(urlSearch.toString())

    return (
        <PageContainer width="wide">
            <PageHeader
                overline="Admin"
                title="Manage Users"
                subtitle="Search users by name or email, filter by role, and block or unblock accounts."
            />

            <Suspense>
                <UrlFilters
                    searchPlaceholder="Search by name or email"
                    selects={[
                        {
                            name: "role",
                            label: "All roles",
                            options: USER_ROLES.map((role) => ({ value: role, label: ROLE_META[role].label })),
                        },
                    ]}
                />
            </Suspense>

            {users.length > 0 ? (
                <div className="surface-card overflow-x-auto">
                    <table className="w-full min-w-[820px] text-left text-sm">
                        <thead className="border-b border-white/10 text-xs text-white/50 uppercase">
                            <tr>
                                <th className="px-5 py-3 font-medium">User</th>
                                <th className="px-5 py-3 font-medium">Role</th>
                                <th className="px-5 py-3 font-medium">Joined</th>
                                <th className="px-5 py-3 font-medium">Status</th>
                                <th className="px-5 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <UserAvatar src={user.image} name={user.name} className="size-9" />
                                            <div className="min-w-0">
                                                <p className="truncate font-medium text-[#EDEDEF]">{user.name}</p>
                                                <p className="truncate text-xs text-white/50">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4"><RolePill role={user.role} /></td>
                                    <td className="px-5 py-4 text-white/70">{formatTimestamp(user.createdAt)}</td>
                                    <td className="px-5 py-4">
                                        <Pill
                                            label={user.isBlocked ? "Blocked" : "Active"}
                                            color={user.isBlocked ? "#EF4444" : "#22C55E"}
                                            dot
                                        />
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                render={<Link href={`/dashboard/admin/users/${user._id}`} />}
                                                nativeButton={false}
                                                variant="outline"
                                                size="sm"
                                                className="gap-1"
                                            >
                                                <Eye aria-hidden /> Details
                                            </Button>
                                            <BlockUserButton user={user} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <EmptyState
                    icon={Users}
                    title="No users match"
                    description="Try a different name, email or role filter."
                />
            )}
        </PageContainer>
    )
}