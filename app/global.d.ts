import Schema from '@/auth-schema'

declare global {
    type Session = typeof Schema.Session.$inferSelect
    type User = typeof Schema.User.$inferSelect
}
