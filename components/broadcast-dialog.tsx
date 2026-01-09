'use client'

import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { sendBulkMessage } from '@/app/actions/send-bulk'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { getAllContacts } from '@/app/actions/get-all-contacts'
import { getGroups } from '@/app/actions/groups'

type Contact = {
    id: number
    firstName: string
    lastName: string | null
    phone: string
}

export function BroadcastDialog({
    open,
    onOpenChange
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const [contactsList, setContactsList] = useState<Contact[]>([])
    const [selectedContacts, setSelectedContacts] = useState<number[]>([])
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [sending, setSending] = useState(false)

    // File upload state
    const [fileUrl, setFileUrl] = useState<string | null>(null)
    const [mimeType, setMimeType] = useState<string | null>(null)

    // Group filter state
    const [groups, setGroups] = useState<{ id: number; name: string }[]>([])
    const [selectedGroupFilter, setSelectedGroupFilter] =
        useState<string>('all')

    useEffect(() => {
        if (open) {
            getGroups().then((res) => {
                if (res.success && res.data) setGroups(res.data)
            })
        }
    }, [open])

    useEffect(() => {
        let mounted = true
        if (open) {
            const fetchContacts = async () => {
                setLoading(true)
                try {
                    const groupId =
                        selectedGroupFilter !== 'all'
                            ? Number(selectedGroupFilter)
                            : undefined
                    const data = await getAllContacts(groupId)
                    if (mounted) {
                        setContactsList(data as Contact[])
                        // Optionally clear selection when filter changes? Or keep?
                        // If we keep, they might send to people not visible.
                        // Let's clear selection for safety/clarity.
                        setSelectedContacts([])
                    }
                } finally {
                    if (mounted) setLoading(false)
                }
            }
            fetchContacts()
        }
        return () => {
            mounted = false
        }
    }, [open, selectedGroupFilter])

    const toggleContact = (id: number) => {
        setSelectedContacts((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        )
    }

    const toggleAll = () => {
        if (selectedContacts.length === contactsList.length) {
            setSelectedContacts([])
        } else {
            setSelectedContacts(contactsList.map((c) => c.id))
        }
    }

    const handleSend = async () => {
        if (selectedContacts.length === 0) {
            toast.error('Select at least one contact')
            return
        }
        if (!message && !fileUrl) {
            toast.error('Enter a message or attach media')
            return
        }

        setSending(true)
        const res = await sendBulkMessage({
            contactIds: selectedContacts,
            messageTemplate: message,
            mediaUrl: fileUrl || undefined, // Using the text input URL for now
            mimeType: mimeType || undefined,
            fileName: undefined // Removed fileName
        })

        setSending(false)
        if (res.success) {
            toast.success(`Sent to ${res.summary?.succeeded} contacts`)
            onOpenChange(false)
            setMessage('')
            setSelectedContacts([])
            setFileUrl(null)
        } else {
            toast.error(res.error || 'Failed to send')
        }
    }

    const insertPlaceholder = (ph: string) => {
        setMessage((prev) => prev + ph)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-2xl h-[80vh] flex flex-col'>
                <DialogHeader>
                    <DialogTitle>Broadcast Message</DialogTitle>
                </DialogHeader>

                <div className='flex flex-1 gap-4 overflow-hidden pt-4'>
                    {/* Contacts Selection */}
                    <div className='w-1/3 border-r pr-4 flex flex-col'>
                        <div className='mb-2'>
                            <Select
                                value={selectedGroupFilter}
                                onValueChange={setSelectedGroupFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Filter by Group' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='all'>
                                        All Contacts
                                    </SelectItem>
                                    {groups.map((g) => (
                                        <SelectItem
                                            key={g.id}
                                            value={String(g.id)}>
                                            {g.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='flex items-center space-x-2 mb-4 border-b pb-2'>
                            <Checkbox
                                checked={
                                    contactsList.length > 0 &&
                                    selectedContacts.length ===
                                        contactsList.length
                                }
                                onCheckedChange={toggleAll}
                            />
                            <Label>Select All ({contactsList.length})</Label>
                        </div>
                        <ScrollArea className='flex-1'>
                            {loading ? (
                                <Loader2 className='animate-spin' />
                            ) : (
                                contactsList.map((contact) => (
                                    <div
                                        key={contact.id}
                                        className='flex items-center space-x-2 py-2'>
                                        <Checkbox
                                            checked={selectedContacts.includes(
                                                contact.id
                                            )}
                                            onCheckedChange={() =>
                                                toggleContact(contact.id)
                                            }
                                        />
                                        <div className='flex flex-col overflow-hidden'>
                                            <span className='text-sm font-medium truncate'>
                                                {contact.firstName}{' '}
                                                {contact.lastName}
                                            </span>
                                            <span className='text-xs text-muted-foreground truncate'>
                                                {contact.phone}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </ScrollArea>
                    </div>

                    {/* Message Composition */}
                    <div className='flex-1 flex flex-col gap-4'>
                        <div className='flex gap-2 mb-2'>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() =>
                                    insertPlaceholder('{{firstName}}')
                                }>
                                Name
                            </Button>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => insertPlaceholder('{{phone}}')}>
                                Phone
                            </Button>
                        </div>
                        <Textarea
                            placeholder='Write your message... Use placeholders like {{firstName}}'
                            className='flex-1 resize-none'
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />

                        <div className='border p-3 rounded-md'>
                            <Label className='mb-2 block'>
                                Attachment (Public URL)
                            </Label>
                            <div className='flex gap-2'>
                                <Input
                                    placeholder='https://example.com/image.jpg'
                                    value={fileUrl || ''}
                                    onChange={(e) => {
                                        setFileUrl(e.target.value)
                                        // Auto-detect type roughly
                                        if (
                                            e.target.value.match(
                                                /\.(jpg|jpeg|png|gif)$/i
                                            )
                                        )
                                            setMimeType('image/jpeg')
                                        else if (
                                            e.target.value.match(/\.(mp4)$/i)
                                        )
                                            setMimeType('video/mp4')
                                        else if (
                                            e.target.value.match(/\.(pdf)$/i)
                                        )
                                            setMimeType('application/pdf')
                                    }}
                                />
                            </div>
                            {/* 
                             <div className="mt-2 text-xs text-muted-foreground">
                                * File upload temporarily disabled. Please host the file and paste the link.
                             </div>
                             */}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <div className='flex-1 flex justify-between items-center text-sm text-muted-foreground'>
                        <span>Selected: {selectedContacts.length}</span>
                    </div>
                    <Button
                        variant='outline'
                        onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSend}
                        disabled={sending || selectedContacts.length === 0}>
                        {sending && (
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        )}
                        Send Broadcast
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
