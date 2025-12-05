import * as authSchema from '@/auth-schema'

import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db'
import { organization, admin } from 'better-auth/plugins'

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'sqlite', // or "pg" or "mysql"
        schema: authSchema
    }),
    plugins: [
        organization(),
        admin({
            defaultRole: 'user'
        })
    ], //pendiente

    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }
    }
})
