'use server'

import { db } from '@/db'
import { messages, contacts } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID

type SendMessageOptions = {
    contactId: number
    body?: string
    mediaUrl?: string
    mimeType?: string
    fileName?: string
}

export async function sendMessage({
    contactId,
    body,
    mediaUrl,
    mimeType,
    fileName
}: SendMessageOptions) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {
        return { success: false, error: 'Unauthorized' }
    }

    const contact = await db.query.contacts.findFirst({
        where: eq(contacts.id, contactId)
    })

    if (!contact) {
        return { success: false, error: 'Contact not found' }
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payload: Record<string, any> = {
            messaging_product: 'whatsapp',
            to: contact.phone
        }

        if (mediaUrl) {
            const type = mimeType?.startsWith('image')
                ? 'image'
                : mimeType?.startsWith('video')
                  ? 'video'
                  : mimeType?.startsWith('audio')
                    ? 'audio'
                    : 'document'

            payload.type = type
            payload[type] = {
                link: mediaUrl,
                caption: body, // Caption works for image/video/document
                filename: fileName
            }
        } else {
            payload.type = 'text'
            payload.text = { body: body }
        }

        const response = await fetch(
            `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${WHATSAPP_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }
        )

        const start = await response.json()

        if (!response.ok) {
            console.error('WhatsApp API Error:', start)
            return {
                success: false,
                error: start.error?.message || 'Failed to send message'
            }
        }

        const waMessageId = start.messages?.[0]?.id

        // 2. Insert into DB
        await db.insert(messages).values({
            contactId: contact.id,
            userId: session.user.id,
            fromMe: true,
            body: body || '', // Body might be empty if just sending media without caption
            type: mediaUrl ? mimeType?.split('/')[0] || 'file' : 'text',
            waMessageId: waMessageId,
            status: 'sent',
            mediaUrl: mediaUrl,
            mimeType: mimeType,
            fileName: fileName
        })

        // 3. Update contact last message
        await db
            .update(contacts)
            .set({ lastMessageAt: new Date() })
            .where(eq(contacts.id, contact.id))

        return { success: true }
    } catch (error) {
        console.error('SendMessage Action Error:', error)
        return { success: false, error: 'Internal Server Error' }
    }
}
