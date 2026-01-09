'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { startConversation } from '@/app/actions/start-conversation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'

export default function ChatPlaceholder({ phone }: { phone: string }) {
    const [message, setMessage] = useState('')
    const [sending, setSending] = useState(false)
    const router = useRouter()

    const handleSend = async () => {
        if (!message.trim()) return

        setSending(true)
        const result = await startConversation({ phone, message })

        if (result.success && result.contactId) {
            router.push(`/chats/${result.contactId}`)
        } else {
            toast.error(result.error || 'Failed to start conversation')
            setSending(false)
        }
    }

    return (
        <div className='flex flex-col h-full items-center justify-center p-8 bg-muted/10'>
            <div className='bg-background border rounded-2xl p-8 max-w-md w-full shadow-sm text-center'>
                <h2 className='text-2xl font-semibold mb-2'>
                    New Conversation
                </h2>
                <p className='text-muted-foreground mb-6'>
                    Start a chat with{' '}
                    <span className='font-mono text-foreground bg-muted px-1 rounded'>
                        {phone}
                    </span>
                </p>

                <div className='flex gap-2'>
                    <Input
                        placeholder='Type your first message...'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={sending || !message.trim()}
                        size='icon'>
                        {sending ? (
                            <Loader2 className='animate-spin w-4 h-4' />
                        ) : (
                            <Send className='w-4 h-4' />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
