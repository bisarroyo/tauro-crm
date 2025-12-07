import AuthSchema from '@/auth-schema'
import ContactSchema from '@/db/schema'

declare global {
    type Session = typeof AuthSchema.Session.$inferSelect
    type User = typeof AuthSchema.User.$inferSelect

    // Contact type
    type ContactType = typeof ContactSchema.$inferSelect
}
