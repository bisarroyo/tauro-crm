import * as authSchema from '@/auth-schema'

import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db'
import { organization } from 'better-auth/plugins'

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'sqlite', // or "pg" or "mysql"
        schema: authSchema
    }),
    plugins: [organization()], //pendiente

    emailAndPassword: {
        enabled: true
    }
})
