'use server'

import { db } from '@/db'
import { groups, contactGroups } from '@/db/schema'
import { eq, inArray, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function createGroup(data: {
    name: string
    description?: string
    color?: string
}) {
    try {
        await db.insert(groups).values(data)
        revalidatePath('/contacts')
        return { success: true }
    } catch (error) {
        console.error('Create Group Error:', error)
        return { success: false, error: 'Failed to create group' }
    }
}

export async function updateGroup(
    id: number,
    data: { name?: string; description?: string; color?: string }
) {
    try {
        await db.update(groups).set(data).where(eq(groups.id, id))
        revalidatePath('/contacts')
        return { success: true }
    } catch (error) {
        console.error('Update Group Error:', error)
        return { success: false, error: 'Failed to update group' }
    }
}

export async function deleteGroup(id: number) {
    try {
        await db.delete(groups).where(eq(groups.id, id))
        revalidatePath('/contacts')
        return { success: true }
    } catch (error) {
        console.error('Delete Group Error:', error)
        return { success: false, error: 'Failed to delete group' }
    }
}

export async function getGroups() {
    try {
        const allGroups = await db.query.groups.findMany()
        return { success: true, data: allGroups }
    } catch (error) {
        console.error('Get Groups Error:', error)
        return { success: false, error: 'Failed to fetch groups', data: [] }
    }
}

export async function addContactsToGroup(
    groupId: number,
    contactIds: number[]
) {
    try {
        if (contactIds.length === 0) return { success: true }

        // Filter out contacts already in the group to avoid duplicates if not handled by unique constraint or ignore
        // SQLite doesn't have "ON CONFLICT DO NOTHING" easily in simple insert with drizzle unless specified.
        // We will check existing memberships.
        const existing = await db.query.contactGroups.findMany({
            where: and(
                eq(contactGroups.groupId, groupId),
                inArray(contactGroups.contactId, contactIds)
            )
        })

        const existingContactIds = new Set(existing.map((e) => e.contactId))
        const newContactIds = contactIds.filter(
            (id) => !existingContactIds.has(id)
        )

        if (newContactIds.length > 0) {
            await db.insert(contactGroups).values(
                newContactIds.map((contactId) => ({
                    groupId,
                    contactId
                }))
            )
        }

        revalidatePath('/contacts')
        return { success: true, addedCount: newContactIds.length }
    } catch (error) {
        console.error('Add Contacts to Group Error:', error)
        return { success: false, error: 'Failed to add contacts to group' }
    }
}

export async function removeContactsFromGroup(
    groupId: number,
    contactIds: number[]
) {
    try {
        if (contactIds.length === 0) return { success: true }

        await db
            .delete(contactGroups)
            .where(
                and(
                    eq(contactGroups.groupId, groupId),
                    inArray(contactGroups.contactId, contactIds)
                )
            )

        revalidatePath('/contacts')
        return { success: true }
    } catch (error) {
        console.error('Remove Contacts from Group Error:', error)
        return { success: false, error: 'Failed to remove contacts from group' }
    }
}
