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
import { toast } from 'sonner'

export default function EditContactDialog({
    contact
}: {
    contact: ContactType
}) {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()
    const { mutate, isPending } = useMutation({
        mutationFn: async (values) => {
            await fetch(`/api/contacts/${contact.id}`, {
                method: 'PUT',
                body: JSON.stringify(values),
                headers: { 'Content-Type': 'application/json' }
            })
        },
        onSuccess: () => {
            toast.success('Contacto actualizado con éxito')
            queryClient.invalidateQueries({ queryKey: ['contacts'] })
            setOpen(false)
        },
        onError: (error, variables, onMutateResult, context) => {
            console.log(error, variables, onMutateResult, context)
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
            mutate(editingContact)
        }
    }

    useEffect(() => {
        setEditingContact(contact)
    }, [contact])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form>
                <DialogTrigger asChild>
                    <Button variant='secondary'>Editar</Button>
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
                        <DialogClose
                            asChild
                            onClick={() => setEditingContact(contact)}>
                            <Button variant='outline'>Cancelar</Button>
                        </DialogClose>
                        <Button
                            type='submit'
                            onClick={handleUpdate}
                            disabled={isPending}>
                            {isPending
                                ? 'Aplicando cambios...'
                                : 'Guardar cambios'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
