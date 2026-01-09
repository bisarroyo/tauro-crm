'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Paperclip, Send, Loader2 } from 'lucide-react'
import { sendMessage } from '@/app/actions/send-message' // We'll assume we wrap server action to be client safe or use direct
// Actually we need to call server action from client.
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function ChatInput({ contactId }: { contactId: number }) {
    const [message, setMessage] = useState('')
    const [sending, setSending] = useState(false)
    const [showUrlInput, setShowUrlInput] = useState(false)
    const [fileUrl, setFileUrl] = useState('')
    const router = useRouter()

    const handleSend = async () => {
        if (!message.trim() && !fileUrl) return

        setSending(true)
        try {
            const res = await sendMessage({
                contactId,
                body: message,
                mediaUrl: fileUrl || undefined,
                mimeType: fileUrl ? 'image/jpeg' : undefined, // Quick hack for MVP
                fileName: fileUrl ? 'image.jpg' : undefined
            })

            if (res.success) {
                setMessage('')
                setFileUrl('')
                setShowUrlInput(false)
                router.refresh()
            } else {
                toast.error(res.error || 'Failed to send')
            }
        } catch {
            toast.error('Error sending message')
        } finally {
            setSending(false)
        }
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
                    disabled={sending || (!message.trim() && !fileUrl)}>
                    {sending ? (
                        <Loader2 className='w-5 h-5 animate-spin' />
                    ) : (
                        <Send className='w-5 h-5' />
                    )}
                </Button>
            </div>
        </div>
    )
}
