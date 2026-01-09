'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { getGroups, addContactsToGroup } from '@/app/actions/groups'
import { toast } from 'sonner'

type Group = {
    id: number
    name: string
    color: string | null
}

export function AddToGroupDialog({
    selectedCount,
    selectedIds,
    onSuccess,
    trigger
}: {
    selectedCount: number
    selectedIds: string[] // Assuming IDs are strings from the contact set, but action needs numbers. Will convert.
    onSuccess?: () => void
    trigger?: React.ReactNode
}) {
    const [groups, setGroups] = useState<Group[]>([])
    const [selectedGroupId, setSelectedGroupId] = useState<string>('')
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open) {
            getGroups().then((res) => {
                if (res.success && res.data) {
                    setGroups(res.data)
                }
            })
        }
    }, [open])

    const handleSubmit = async () => {
        if (!selectedGroupId) {
            toast.error('Please select a group')
            return
        }

        setLoading(true)
        // Convert string IDs to numbers if needed, assuming contact IDs are numeric in DB but likely handled as strings in frontend Selection Set
        // The schema says contacts.id is integer. Frontend items.id is likely number in schema types but check `ContactType`.
        // The `contacts/page.tsx` uses `selected: Set<string>`, so we need to parse them.

        // Wait, contacts.id in schema is integer.
        const numericIds = selectedIds
            .map((id) => Number(id))
            .filter((n) => !isNaN(n))

        const res = await addContactsToGroup(
            Number(selectedGroupId),
            numericIds
        )
        setLoading(false)

        if (res.success) {
            toast.success(
                `Added ${res.addedCount ?? numericIds.length} contacts to group`
            )
            setOpen(false)
            onSuccess?.()
        } else {
            toast.error(res.error || 'Failed to add contacts')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant='outline' disabled={selectedCount === 0}>
                        Add to Group
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>
                        Add {selectedCount} Contacts to Group
                    </DialogTitle>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                    <div className='grid gap-2'>
                        <Label>Select Group</Label>
                        <Select
                            onValueChange={setSelectedGroupId}
                            value={selectedGroupId}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select a group...' />
                            </SelectTrigger>
                            <SelectContent>
                                {groups.map((group) => (
                                    <SelectItem
                                        key={group.id}
                                        value={String(group.id)}>
                                        <div className='flex items-center gap-2'>
                                            <div
                                                className='w-2 h-2 rounded-full'
                                                style={{
                                                    backgroundColor:
                                                        group.color || '#000'
                                                }}
                                            />
                                            {group.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || !selectedGroupId}>
                        {loading ? 'Adding...' : 'Add'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
