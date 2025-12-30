'use client'
import { createContactAction } from '@/app/actions/contact'
import { useActionState, useEffect } from 'react'
import { useState } from 'react'

import { MailIcon, Phone, User, Users } from 'lucide-react'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput
} from '@/components/ui/input-group'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function ChatsPage() {
    const initialState = {
        error: '',
        success: false
    }
    const [state, formAction, pending] = useActionState(
        createContactAction,
        initialState
    )
    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        countryCode: '506',
        status: 'new',
        priority: '1'
    })

    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormValues({ ...formValues, [name]: value })
    }

    useEffect(() => {
        if (state.success) {
            router.push('/contacts')
        }
    }, [state.success, router])
    return (
        <div className=''>
            <h2 className='text-xl mb-4'>Crear contacto nuevo</h2>
            <form action={formAction}>
                <div className='grid w-full max-w-sm gap-6'>
                    <InputGroup>
                        <InputGroupInput
                            placeholder='Nombre'
                            type='text'
                            name='firstName'
                            value={formValues.firstName}
                            onChange={handleChange}
                        />
                        <InputGroupAddon>
                            <User />
                        </InputGroupAddon>
                    </InputGroup>
                    <InputGroup>
                        <InputGroupInput
                            placeholder='Apellido'
                            type='text'
                            name='lastName'
                            value={formValues.lastName}
                            onChange={handleChange}
                        />
                        <InputGroupAddon>
                            <Users />
                        </InputGroupAddon>
                    </InputGroup>
                    <InputGroup>
                        <InputGroupInput
                            type='email'
                            placeholder='Correo electrónico'
                            name='email'
                            value={formValues.email}
                            onChange={handleChange}
                        />
                        <InputGroupAddon>
                            <MailIcon />
                        </InputGroupAddon>
                    </InputGroup>
                    <div className='flex flex-row gap-3'>
                        <Select
                            name='countryCode'
                            value={formValues.countryCode}
                            onValueChange={(value) =>
                                setFormValues({
                                    ...formValues,
                                    countryCode: value
                                })
                            }>
                            <SelectTrigger className='w-[180px]'>
                                <SelectValue placeholder='Seleciona país' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Países</SelectLabel>
                                    <SelectItem value='506'>
                                        Costa Rica
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <InputGroup>
                            <InputGroupInput
                                placeholder='8888-8888'
                                type='text'
                                name='phone'
                                value={formValues.phone}
                                onChange={handleChange}
                            />
                            <InputGroupAddon>
                                <Phone />
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                    <div className='flex flex-row gap-3'>
                        <Select
                            name='status'
                            value={formValues.status}
                            onValueChange={(value) =>
                                setFormValues({
                                    ...formValues,
                                    status: value
                                })
                            }>
                            <SelectTrigger className='w-[180px]'>
                                <SelectValue placeholder='Estado' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Selecciona</SelectLabel>
                                    <SelectItem value='new'>Nuevo</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Select
                            name='priority'
                            value={formValues.priority}
                            onValueChange={(value) =>
                                setFormValues({
                                    ...formValues,
                                    priority: value
                                })
                            }>
                            <SelectTrigger className='w-[180px]'>
                                <SelectValue placeholder='Prioridad' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Slecciona</SelectLabel>
                                    <SelectItem value='1'>Baja</SelectItem>
                                    <SelectItem value='2'>Media</SelectItem>
                                    <SelectItem value='3'>Alta</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type='submit' disabled={pending}>
                        Crear contacto
                    </Button>
                </div>
            </form>
            {state.error && (
                <div className='mt-4 p-3 bg-red-100 text-red-600 rounded-md text-sm'>
                    {state.error.split(', ').map((err, idx) => (
                        <div key={idx}>{err}</div>
                    ))}
                </div>
            )}
        </div>
    )
}
