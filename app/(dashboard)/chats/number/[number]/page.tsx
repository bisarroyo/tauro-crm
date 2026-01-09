import { db } from '@/db'
import { contacts } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import ChatPlaceholder from '@/components/chat-placeholder'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export default async function Page({
    params
}: {
    params: Promise<{ number: string }>
}) {
    const { number } = await params
    // Decode phone number (e.g. replacing %2B with +)
    const phone = decodeURIComponent(number)

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {
        redirect('/')
    }

    // Check if contact exists
    const contact = await db.query.contacts.findFirst({
        where: eq(contacts.phone, phone)
    })

    if (contact) {
        // If contact exists, redirect to the chat page
        redirect(`/chats/${contact.id}`)
    }

    // If contact does not exist, show placeholder to start chat
    return <ChatPlaceholder phone={phone} />
}
