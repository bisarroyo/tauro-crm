'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    createGroup,
    deleteGroup,
    getGroups,
    updateGroup
} from '@/app/actions/groups'
import { toast } from 'sonner'
import { Trash2, Edit2, Plus } from 'lucide-react'

type Group = {
    id: number
    name: string
    description: string | null
    color: string | null
}

export function GroupManager({
    onGroupChange
}: {
    onGroupChange?: () => void
}) {
    const [groups, setGroups] = useState<Group[]>([])
    const [open, setOpen] = useState(false)
    const [editingGroup, setEditingGroup] = useState<Group | null>(null)
    const [newGroupName, setNewGroupName] = useState('')
    const [newGroupColor, setNewGroupColor] = useState('#000000')

    const fetchGroups = async () => {
        const res = await getGroups()
        if (res.success && res.data) {
            setGroups(res.data)
        }
    }

    useEffect(() => {
        let mounted = true
        if (open) {
            getGroups().then((res) => {
                if (mounted && res.success && res.data) {
                    setGroups(res.data)
                }
            })
        }
        return () => {
            mounted = false
        }
    }, [open])

    const handleCreate = async () => {
        if (!newGroupName) return
        const res = await createGroup({
            name: newGroupName,
            color: newGroupColor
        })
        if (res.success) {
            toast.success('Group created')
            setNewGroupName('')
            fetchGroups()
            onGroupChange?.()
        } else {
            toast.error(res.error || 'Failed')
        }
    }

    const handleUpdate = async () => {
        if (!editingGroup || !newGroupName) return
        const res = await updateGroup(editingGroup.id, {
            name: newGroupName,
            color: newGroupColor
        })
        if (res.success) {
            toast.success('Group updated')
            setEditingGroup(null)
            setNewGroupName('')
            fetchGroups()
            onGroupChange?.()
        } else {
            toast.error(res.error || 'Failed')
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this group?')) return
        const res = await deleteGroup(id)
        if (res.success) {
            toast.success('Group deleted')
            fetchGroups()
            onGroupChange?.()
        } else {
            toast.error(res.error || 'Failed')
        }
    }

    const startEdit = (group: Group) => {
        setEditingGroup(group)
        setNewGroupName(group.name)
        setNewGroupColor(group.color || '#000000')
    }

    const cancelEdit = () => {
        setEditingGroup(null)
        setNewGroupName('')
        setNewGroupColor('#000000')
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='outline'>Manage Groups</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Manage Contact Groups</DialogTitle>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                    <div className='flex gap-2 items-end'>
                        <div className='grid gap-1.5 flex-1'>
                            <Label htmlFor='name'>
                                {editingGroup ? 'Edit Group' : 'New Group'}
                            </Label>
                            <Input
                                id='name'
                                value={newGroupName}
                                onChange={(e) =>
                                    setNewGroupName(e.target.value)
                                }
                                placeholder='Group Name'
                            />
                        </div>
                        <div className='grid gap-1.5'>
                            <Label htmlFor='color'>Color</Label>
                            <Input
                                id='color'
                                type='color'
                                className='w-12 p-1 h-10'
                                value={newGroupColor}
                                onChange={(e) =>
                                    setNewGroupColor(e.target.value)
                                }
                            />
                        </div>
                        {editingGroup ? (
                            <div className='flex gap-1'>
                                <Button size='sm' onClick={handleUpdate}>
                                    Save
                                </Button>
                                <Button
                                    size='sm'
                                    variant='ghost'
                                    onClick={cancelEdit}>
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                            <Button size='sm' onClick={handleCreate}>
                                <Plus className='w-4 h-4' />
                            </Button>
                        )}
                    </div>

                    <div className='space-y-2 max-h-[300px] overflow-y-auto mt-2'>
                        {groups.map((group) => (
                            <div
                                key={group.id}
                                className='flex items-center justify-between p-2 border rounded-md'>
                                <div className='flex items-center gap-2'>
                                    <div
                                        className='w-3 h-3 rounded-full'
                                        style={{
                                            backgroundColor:
                                                group.color || '#000'
                                        }}
                                    />
                                    <span>{group.name}</span>
                                </div>
                                <div className='flex gap-1'>
                                    <Button
                                        size='icon'
                                        variant='ghost'
                                        className='h-8 w-8'
                                        onClick={() => startEdit(group)}>
                                        <Edit2 className='w-4 h-4' />
                                    </Button>
                                    <Button
                                        size='icon'
                                        variant='ghost'
                                        className='h-8 w-8 text-destructive'
                                        onClick={() => handleDelete(group.id)}>
                                        <Trash2 className='w-4 h-4' />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {groups.length === 0 && (
                            <p className='text-sm text-muted-foreground text-center py-4'>
                                No groups created yet.
                            </p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
