'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'

export default function EditContactDialog({
    contact
}: {
    contact: ContactType
}) {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (values) => {
            await fetch(`/api/contacts/${contact.id}`, {
                method: 'PUT',
                body: JSON.stringify(values),
                headers: { 'Content-Type': 'application/json' }
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacts'] })
        }
    })
    const [editingContact, setEditingContact] = useState<ContactType | null>(
        contact ?? null
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setEditingContact((prev: ContactType) =>
            prev ? { ...prev, [name]: value } : prev
        )
    }
    const handleUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (editingContact) {
            mutation.mutate(editingContact)
        }
    }

    useEffect(() => {
        setEditingContact(contact)
    }, [contact])

    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button variant='outline'>Editar</Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[425px]'>
                    <DialogHeader>
                        <DialogTitle>Editar perfil</DialogTitle>
                        <DialogDescription>
                            Asegúrate de que la información sea correcta antes
                            deguardar los cambios.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4'>
                        <div className='grid gap-3'>
                            <Label htmlFor='name-1'>Name</Label>
                            <Input
                                id='firstName'
                                name='firstName'
                                value={editingContact.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='grid gap-3'>
                            <Label htmlFor='name-1'>Apellidos</Label>
                            <Input
                                id='lastName'
                                name='lastName'
                                value={editingContact.lastName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='grid gap-3'>
                            <Label htmlFor='name-1'>Teléfono</Label>
                            <Input
                                id='phone'
                                name='phone'
                                value={editingContact.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='grid gap-3'>
                            <Label htmlFor='name-1'>Email</Label>
                            <Input
                                id='email'
                                name='email'
                                type='email'
                                value={editingContact.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant='outline'>Cancelar</Button>
                        </DialogClose>
                        <Button type='submit' onClick={handleUpdate}>
                            Aplicar cambios
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
