import { sql } from 'drizzle-orm'
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
    id: text('id').primaryKey(), // UUID (from better-auth user id)
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    role: text('role').notNull().default('user'), // 'user' | 'admin'
    createdAt: integer('created_at', { mode: 'timestamp' }).default(
        sql`(unixepoch())`
    )
})

export const contacts = sqliteTable('contacts', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    firstName: text('first_name').notNull(),
    lastName: text('last_name'),
    phone: text('phone'),
    email: text('email'),
    status: text('status').default('new'), // new, contacted, qualified, lost, customer
    assignedTo: text('assigned_to')
        .references(() => users.id)
        .notNull(),
    notes: text('notes'),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(
        sql`(unixepoch())`
    ),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
        .default(sql`(unixepoch())`)
        .$onUpdate(() => new Date())
})

export const messages = sqliteTable('messages', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    contactId: integer('contact_id').references(() => contacts.id),
    userId: text('user_id')
        .references(() => users.id)
        .notNull(), // who sent (null if from contact)
    fromMe: integer('from_me', { mode: 'boolean' }).notNull(),
    body: text('body').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(
        sql`(unixepoch())`
    )
})

export const tasks = sqliteTable('tasks', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    contactId: integer('contact_id').references(() => contacts.id),
    title: text('title').notNull(),
    dueAt: integer('due_at', { mode: 'timestamp' }).notNull(),
    status: text('status').default('pending'), // pending, done, canceled
    assignedTo: text('assigned_to')
        .references(() => users.id)
        .notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(
        sql`(unixepoch())`
    )
})
