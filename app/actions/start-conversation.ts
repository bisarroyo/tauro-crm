'use server'

import { db } from '@/db'
import { contacts } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { sendMessage } from '@/app/actions/send-message'
import { revalidatePath } from 'next/cache'

export async function startConversation({
    phone,
    message
}: {
    phone: string
    message: string
}) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {
        return { success: false, error: 'Unauthorized' }
    }

    try {
        // 1. Check if contact exists
        let contact = await db.query.contacts.findFirst({
            where: eq(contacts.phone, phone)
        })

        // 2. If not, create it
        if (!contact) {
            // Basic parsing or user ID assignment
            // For now, assigning to current user
            const result = await db
                .insert(contacts)
                .values({
                    phone: phone,
                    firstName: phone, // Placeholder name
                    lastName: '',
                    countryCode: 'US', // TODO: Parse from phone
                    email: `${phone}@placeholder.com`, // Placeholder email
                    assignedTo: session.user.id,
                    status: 'new',
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
                .returning()
            contact = result[0]
        }

        // 3. Send Message
        const sendResult = await sendMessage({
            contactId: contact.id,
            body: message
        })

        if (!sendResult.success) {
            return { success: false, error: sendResult.error }
        }

        revalidatePath('/chats')
        return { success: true, contactId: contact.id }
    } catch (error) {
        console.error('StartConversation Error:', error)
        return { success: false, error: 'Internal Server Error' }
    }
}
