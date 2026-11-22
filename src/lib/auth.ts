import { betterAuth } from "better-auth"
import { APIError, createAuthMiddleware } from "better-auth/api"
import { MongoClient, ObjectId } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"

const client = new MongoClient(process.env.BETTER_AUTH_DB_URI as string)
const db = client.db("wedplandb")

// Only these roles can be chosen at sign up. Admins are assigned on the
// server (`npm run make-admin` in wedplan-server), never through registration.
const SIGNUP_ROLES = ["vendor", "customer"]

// Fields a user must never be able to change through Better Auth's updateUser.
const PROTECTED_FIELDS = [
    "role",
    "isBlocked",
    "subscriptionPlan",
    "subscriptionExpiresAt",
]

export const auth = betterAuth({
    //...

    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
    },
    user: {
        additionalFields: {
            role: {
                type: ["customer", "vendor", "admin"],
                input: true,
                defaultValue: "customer",
            },
            isBlocked: {
                type: "boolean",
                input: false,
                defaultValue: false,
            },
            businessName: {
                type: "string",
                required: false,
                input: true,
            },
            subscriptionPlan: {
                type: ["free", "premium"],
                input: false,
                defaultValue: "free",
            },
            subscriptionExpiresAt: {
                type: "date",
                required: false,
                input: false,
            },
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    database: mongodbAdapter(db, {
        client,
    }),
    hooks: {
        // Server side password rules: 6+ characters, one uppercase, one lowercase.
        before: createAuthMiddleware(async (ctx) => {
            if (ctx.path !== "/sign-up/email") return

            const password = String(ctx.body?.password ?? "")
            if (
                password.length < 6 ||
                !/[A-Z]/.test(password) ||
                !/[a-z]/.test(password)
            ) {
                throw new APIError("BAD_REQUEST", {
                    message:
                        "Password needs 6+ characters with an uppercase and a lowercase letter",
                })
            }
        }),
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => ({
                    data: {
                        ...user,
                        // never trust the role sent by the browser
                        role: SIGNUP_ROLES.includes(String(user.role))
                            ? user.role
                            : "customer",
                        isBlocked: false,
                        subscriptionPlan: "free",
                    },
                }),
            },
            update: {
                before: async (data) => ({
                    data: Object.fromEntries(
                        Object.entries(data).filter(
                            ([key]) => !PROTECTED_FIELDS.includes(key)
                        )
                    ),
                }),
            },
        },
        session: {
            create: {
                // blocked users cannot start a new session (password or Google)
                before: async (session) => {
                    const user = await db
                        .collection("user")
                        .findOne({ _id: new ObjectId(String(session.userId)) })
                    if (user?.isBlocked) return false
                },
            },
        },
    },
})