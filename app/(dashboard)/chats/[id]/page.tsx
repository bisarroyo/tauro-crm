import { db } from '@/db'
import { contacts, messages } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import ChatInput from '@/components/chat-input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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
            <ScrollArea className='flex-1 p-4 bg-muted/5'>
                <div className='max-w-3xl mx-auto space-y-4'>
                    {chatMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`
                                    max-w-[70%] rounded-2xl px-4 py-2 shadow-sm
                                    ${msg.fromMe ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-white border rounded-bl-none'}
                                `}>
                                {msg.mediaUrl && (
                                    <div className='mb-2'>
                                        {/* Basic handling for images, other types would need more logic */}
                                        {msg.mimeType?.startsWith('image') ||
                                        msg.mediaUrl.match(
                                            /\.(jpg|jpeg|png|gif)$/i
                                        ) ? (
                                            <>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={msg.mediaUrl}
                                                    alt='Media'
                                                    className='rounded-lg max-w-full'
                                                />
                                            </>
                                        ) : (
                                            <a
                                                href={msg.mediaUrl}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='underline text-sm opacity-90 break-all'>
                                                {msg.fileName ||
                                                    'View Attachment'}
                                            </a>
                                        )}
                                    </div>
                                )}
                                <p className='whitespace-pre-wrap leading-relaxed'>
                                    {msg.body}
                                </p>
                                <div
                                    className={`text-[10px] mt-1 flex justify-end opacity-70 ${msg.fromMe ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                                    {msg.createdAt
                                        ? format(msg.createdAt, 'HH:mm')
                                        : ''}
                                    {msg.fromMe && (
                                        <span className='ml-1'>
                                            {msg.status === 'read'
                                                ? '✓✓'
                                                : msg.status === 'delivered'
                                                  ? '✓✓'
                                                  : '✓'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {chatMessages.length === 0 && (
                        <div className='text-center text-muted-foreground text-sm py-10'>
                            Start a conversation with {contact.firstName}
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Input */}
            <ChatInput contactId={contactId} />
        </div>
    )
}
