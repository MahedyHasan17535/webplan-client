import type { auth } from "@/lib/auth"
import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"

// `inferAdditionalFields<typeof auth>` pulls in the server schema so fields
// declared in `lib/auth.ts` (e.g. `user.additionalFields.role`) are typed here.
export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
})

export const { signIn, signUp, signOut, useSession } = authClient