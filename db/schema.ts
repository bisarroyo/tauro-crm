import { sql } from 'drizzle-orm'
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'
import { user } from '@/auth-schema'

export const contacts = sqliteTable('contacts', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    firstName: text('first_name').notNull(),
    lastName: text('last_name'),
    phone: text('phone').notNull(),
    countryCode: text('country_code').notNull(),
    email: text('email').notNull(),
    status: text('status').default('new'),
    priority: integer('priority').default(1),
    assignedTo: text('assigned_to')
        .references(() => user.id)
        .notNull(),
    notes: text('notes'),
    lastMessageAt: integer('last_message_at', { mode: 'timestamp' }),
    unreadCount: integer('unread_count').default(0),
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
    userId: text('user_id').references(() => user.id), // who sent (null if from contact)
    fromMe: integer('from_me', { mode: 'boolean' }).notNull(),
    body: text('body').notNull(),
    type: text('type').default('text').notNull(), // text, image, etc
    waMessageId: text('wa_message_id'),
    status: text('status').default('sent'), // sent, delivered, read, failed
    mediaUrl: text('media_url'),
    mimeType: text('mime_type'),
    fileName: text('file_name'),
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
        .references(() => user.id)
        .notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(
        sql`(unixepoch())`
    )
})

export const groups = sqliteTable('groups', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull().unique(),
    description: text('description'),
    color: text('color').default('#000000'),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(
        sql`(unixepoch())`
    ),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
        .default(sql`(unixepoch())`)
        .$onUpdate(() => new Date())
})

export const contactGroups = sqliteTable('contact_groups', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    contactId: integer('contact_id')
        .references(() => contacts.id, { onDelete: 'cascade' })
        .notNull(),
    groupId: integer('group_id')
        .references(() => groups.id, { onDelete: 'cascade' })
        .notNull(),
    assignedAt: integer('assigned_at', { mode: 'timestamp' }).default(
        sql`(unixepoch())`
    )
})
