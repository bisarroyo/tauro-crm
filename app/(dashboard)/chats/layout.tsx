import { db } from '@/db'
import { contacts } from '@/db/schema'
import { desc, isNotNull } from 'drizzle-orm'
import Link from 'next/link'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import BroadcastButton from '@/components/broadcast-button'
import { NewChatDialog } from '@/components/new-chat-dialog'

async function getChats() {
    return await db.query.contacts.findMany({
        where: isNotNull(contacts.lastMessageAt),
        orderBy: [desc(contacts.lastMessageAt)]
    })
}

export default async function ChatsLayout({
    children
}: {
    children: React.ReactNode
}) {
    const chats = await getChats()

    return (
        <div className='flex h-full'>
            <div className='w-80 border-r flex flex-col bg-muted/10'>
                <div className='p-4 border-b flex justify-between items-center bg-background'>
                    <h2 className='font-semibold text-lg'>Chats</h2>
                    <div className='flex gap-2'>
                        <BroadcastButton />
                        <NewChatDialog />
                    </div>
                </div>
                <ScrollArea className='flex-1'>
                    <div className='flex flex-col'>
                        {chats.length === 0 ? (
                            <div className='p-4 text-center text-muted-foreground text-sm'>
                                No active chats
                            </div>
                        ) : (
                            chats.map((chat) => (
                                <Link
                                    key={chat.id}
                                    href={`/chats/${chat.id}`}
                                    className='p-4 border-b hover:bg-muted/50 transition-colors flex gap-3 items-start'>
                                    <Avatar>
                                        <AvatarImage
                                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${chat.firstName} ${chat.lastName}`}
                                        />
                                        <AvatarFallback>
                                            {chat.firstName[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className='flex-1 overflow-hidden'>
                                        <div className='flex justify-between items-baseline mb-1'>
                                            <span className='font-medium truncate'>
                                                {chat.firstName} {chat.lastName}
                                            </span>
                                            {chat.lastMessageAt && (
                                                <span className='text-xs text-muted-foreground'>
                                                    {format(
                                                        chat.lastMessageAt,
                                                        'HH:mm'
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                        <div className='flex justify-between items-center'>
                                            <p className='text-sm text-muted-foreground truncate w-32'>
                                                {/* Requires fetching last message preview or storing it on contact */}
                                                Click to view
                                            </p>
                                            {Boolean(chat.unreadCount) && (
                                                <span className='bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                                                    {chat.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>
            <div className='flex-1 flex flex-col bg-background'>{children}</div>
        </div>
    )
}
