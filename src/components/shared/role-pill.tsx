import { Pill } from "@/components/shared/pill"
import { ROLE_META, type UserRole } from "@/lib/types"

export function RolePill({ role }: { role: UserRole }) {
    const { label, color } = ROLE_META[role]
    return <Pill label={label} color={color} dot />
}