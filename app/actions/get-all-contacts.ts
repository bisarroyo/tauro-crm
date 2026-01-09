'use server'

import { db } from '@/db'
import { contacts, contactGroups } from '@/db/schema'
import { desc, eq, inArray } from 'drizzle-orm'

export async function getAllContacts(groupId?: number) {
    if (groupId) {
        const members = await db
            .select({ contactId: contactGroups.contactId })
            .from(contactGroups)
            .where(eq(contactGroups.groupId, groupId))

        if (members.length === 0) return []

        const memberIds = members.map((m) => m.contactId)

        return await db.query.contacts.findMany({
            where: inArray(contacts.id, memberIds),
            orderBy: [desc(contacts.createdAt)]
        })
    }

    return await db.query.contacts.findMany({
        orderBy: [desc(contacts.createdAt)]
    })
}
