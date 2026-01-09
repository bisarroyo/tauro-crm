'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { Button } from '@/components/ui/button'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function ContactPage() {
    const [editingContact, setEditingContact] = useState<ContactType | null>(
        null
    )

    const { id } = useParams()
    const queryClient = useQueryClient()
    const { mutate, isPending } = useMutation({
        mutationFn: async (values) => {
            await fetch(`/api/contacts/${id}`, {
                method: 'PUT',
                body: JSON.stringify(values),
                headers: { 'Content-Type': 'application/json' }
            })
        },
        onSuccess: () => {
            toast.success('Contacto actualizado con éxito')
            queryClient.invalidateQueries({ queryKey: ['contacts'] })
        },
        onError: (error, variables, onMutateResult, context) => {
            console.log(error, variables, onMutateResult, context)
        }
    })

    const { data, isLoading } = useQuery({
        queryKey: ['contact', id],
        queryFn: async () => {
            const res = await fetch(`/api/contacts/${id}`)
            if (!res.ok) {
                return null
            }
            const data = await res.json()
            setEditingContact(data)
            return data
        }
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setEditingContact((prev: ContactType) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }
    const handleUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (editingContact) {
            mutate(editingContact)
        }
    }

    return isLoading ? (
        <div>Loading...</div>
    ) : (
        <div className='p-4'>
            <h2>Editar contacto</h2>
            <form>
                <div className='grid gap-4 mb-8'>
                    <div className='grid gap-4 grid-cols-2'>
                        <div className='grid gap-3'>
                            <Label htmlFor='firstName'>Nombre</Label>
                            <Input
                                id='firstName'
                                name='firstName'
                                value={editingContact?.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='grid gap-3'>
                            <Label htmlFor='lastName'>Apellidos</Label>
                            <Input
                                id='lastName'
                                name='lastName'
                                value={editingContact?.lastName || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className='grid gap-4 grid-cols-2'>
                        <div className='grid gap-3'>
                            <Label htmlFor='phone'>Teléfono</Label>
                            <Input
                                id='phone'
                                name='phone'
                                type='number'
                                inputMode='numeric'
                                value={editingContact?.phone || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='grid gap-3'>
                            <Label htmlFor='email'>Email</Label>
                            <Input
                                id='email'
                                name='email'
                                type='email'
                                value={editingContact?.email || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
                <Button
                    type='submit'
                    onClick={handleUpdate}
                    disabled={isPending}>
                    {isPending ? 'Aplicando cambios...' : 'Guardar cambios'}
                </Button>
            </form>
        </div>
    )
}
