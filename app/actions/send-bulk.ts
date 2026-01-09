'use server'

import { db } from '@/db'
import { contacts } from '@/db/schema'
import { inArray } from 'drizzle-orm'
import { sendMessage } from './send-message'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

type BulkSendOptions = {
    contactIds: number[]
    messageTemplate: string // e.g., "Hello {{firstName}}, ..."
    mediaUrl?: string
    mimeType?: string
    fileName?: string
}

export async function sendBulkMessage({
    contactIds,
    messageTemplate,
    mediaUrl,
    mimeType,
    fileName
}: BulkSendOptions) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {
        return { success: false, error: 'Unauthorized' }
    }

    if (contactIds.length === 0) {
        return { success: false, error: 'No contacts selected' }
    }

    try {
        // Fetch contact details to replace placeholders
        const targetContacts = await db.query.contacts.findMany({
            where: inArray(contacts.id, contactIds)
        })

        let successCount = 0
        let failureCount = 0
        const errors: { contactId: number; error?: string }[] = []

        // Intentional sequential processing to avoid rate limits (though for large lists we'd use a queue)
        for (const contact of targetContacts) {
            let body = messageTemplate

            // Replace common placeholders
            body = body.replace(/{{firstName}}/g, contact.firstName || '')
            body = body.replace(/{{lastName}}/g, contact.lastName || '')
            body = body.replace(
                /{{name}}/g,
                `${contact.firstName} ${contact.lastName}`.trim()
            )
            body = body.replace(/{{phone}}/g, contact.phone)

            const result = await sendMessage({
                contactId: contact.id,
                body: body,
                mediaUrl,
                mimeType,
                fileName
            })

            if (result.success) {
                successCount++
            } else {
                failureCount++
                errors.push({ contactId: contact.id, error: result.error })
            }
        }

        return {
            success: true,
            summary: {
                total: contactIds.length,
                succeeded: successCount,
                failed: failureCount,
                errors: errors.slice(0, 5) // Return limited errors
            }
        }
    } catch (error) {
        console.error('BulkSend Action Error:', error)
        return { success: false, error: 'Internal Server Error' }
    }
}
