'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Paperclip, Send, Loader2 } from 'lucide-react'

import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function ChatInput({ contactId }: { contactId: number }) {
    const [message, setMessage] = useState('')
    const [showUrlInput, setShowUrlInput] = useState(false)
    const [fileUrl, setFileUrl] = useState('')
    const router = useRouter()
    const queryClient = useQueryClient()

    const sendMessageMutation = useMutation({
        mutationFn: async (payload: {
            contactId: number
            body: string
            mediaUrl?: string
            mimeType?: string
            fileName?: string
        }) => {
            const res = await fetch('/api/whatsapp/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.error || 'Error al enviar mensaje')
            }
            return data
        },
        onSuccess: () => {
            setMessage('')
            setFileUrl('')
            setShowUrlInput(false)
            queryClient.invalidateQueries({ queryKey: ['messages', contactId] })
            router.refresh()
            toast.success('Mensaje enviado')
        },
        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Error al enviar mensaje'
            )
        }
    })

    const handleSend = async () => {
        if (!message.trim() && !fileUrl) return

        console.log('Sending message:', { message, contactId })

        sendMessageMutation.mutate({
            contactId,
            body: message,
            mediaUrl: fileUrl || undefined,
            mimeType: fileUrl ? 'image/jpeg' : undefined, // Quick hack for MVP
            fileName: fileUrl ? 'image.jpg' : undefined
        })
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className='p-4 border-t bg-background'>
            {showUrlInput && (
                <div className='mb-2 flex gap-2'>
                    <input
                        className='flex-1 border rounded px-2 py-1 text-sm'
                        placeholder='Paste image URL...'
                        value={fileUrl}
                        onChange={(e) => setFileUrl(e.target.value)}
                    />
                    <Button
                        size='sm'
                        variant='ghost'
                        onClick={() => setShowUrlInput(false)}>
                        <h2 className='text-xs'>Cancel</h2>
                    </Button>
                </div>
            )}
            <div className='flex gap-2 items-end'>
                <Button
                    size='icon'
                    variant={fileUrl ? 'secondary' : 'ghost'}
                    className='shrink-0'
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    title='Attach Image URL'>
                    <Paperclip className='w-5 h-5' />
                </Button>
                <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='Type a message...'
                    className='min-h-10 max-h-32 resize-none py-3'
                />
                <Button
                    size='icon'
                    className='shrink-0'
                    onClick={handleSend}
                    disabled={
                        sendMessageMutation.isPending ||
                        (!message.trim() && !fileUrl)
                    }>
                    {sendMessageMutation.isPending ? (
                        <Loader2 className='w-5 h-5 animate-spin' />
                    ) : (
                        <Send className='w-5 h-5' />
                    )}
                </Button>
            </div>
        </div>
    )
}
