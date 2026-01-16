import { db } from '@/db'
import { contacts, messages } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import ChatInput from '@/components/chat-input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChatMessages } from '@/components/chat-messages'

async function getContactAndMessages(id: number) {
    const contact = await db.query.contacts.findFirst({
        where: eq(contacts.id, id)
    })

    if (!contact) return { contact: null, messages: [] }

    const chatMessages = await db.query.messages.findMany({
        where: eq(messages.contactId, id),
        orderBy: [asc(messages.createdAt)]
    })

    return { contact, messages: chatMessages }
}

export default async function ChatPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    // Resolve params (Next.js 15+ requirement if async)
    const { id } = await params
    const contactId = parseInt(id)
    if (isNaN(contactId)) notFound()

    const { contact, messages: chatMessages } =
        await getContactAndMessages(contactId)

    if (!contact) notFound()

    return (
        <div className='flex flex-col h-full'>
            {/* Header */}
            <div className='h-16 border-b flex items-center px-6 bg-background shrink-0'>
                <Avatar className='h-10 w-10 mr-4'>
                    <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${contact.firstName} ${contact.lastName}`}
                    />
                    <AvatarFallback>{contact.firstName[0]}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className='font-semibold'>
                        {contact.firstName} {contact.lastName}
                    </h2>
                    <p className='text-sm text-muted-foreground'>
                        {contact.phone}
                    </p>
                </div>
            </div>

            {/* Messages Area */}
            <ChatMessages messages={chatMessages} contact={contact} />

            {/* Input */}
            <ChatInput contactId={contactId} />
        </div>
    )
}
