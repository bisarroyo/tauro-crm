'use client'

import { useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'

export function ChatMessages({
    messages,
    contact
}: {
    messages: {
        id: number
        contactId: number | null
        body: string
        fromMe: boolean
        createdAt: Date | null
        status: string | null
        mediaUrl?: string | null
        mimeType?: string | null
        fileName?: string | null
    }[]
    contact: {
        id: number
        firstName: string
        lastName: string | null
        phone: string
    }
}) {
    const bottomRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <ScrollArea className='flex-1 bg-muted/5 h-72'>
            <div className='max-w-3xl mx-auto space-y-4'>
                {messages.map((msg) => (
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
                                            {msg.fileName || 'View Attachment'}
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
                {messages.length === 0 && (
                    <div className='text-center text-muted-foreground text-sm py-10'>
                        Start a conversation with {contact.firstName}
                    </div>
                )}
                {/* 👇 ancla de scroll */}
                <div ref={bottomRef} />
            </div>
        </ScrollArea>
    )
}
