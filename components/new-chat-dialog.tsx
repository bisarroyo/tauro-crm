'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'

export function NewChatDialog() {
    const [open, setOpen] = useState(false)
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleStart = () => {
        if (!phone) return

        setLoading(true)
        // Encode phone to ensure it handles + signs etc safely in URL
        router.push(`/chats/number/${encodeURIComponent(phone)}`)
        setOpen(false)
        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size='icon' variant='ghost' title='New Chat'>
                    <Plus className='w-5 h-5' />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Conversation</DialogTitle>
                    <DialogDescription>
                        Enter a phone number to start a new chat (include
                        country code).
                    </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                    <div className='grid gap-2'>
                        <Label htmlFor='phone'>Phone Number</Label>
                        <Input
                            id='phone'
                            placeholder='e.g. 15551234567'
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleStart()
                            }}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleStart} disabled={loading || !phone}>
                        Start Chat
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
