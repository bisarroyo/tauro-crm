'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { z } from 'zod'

import { db } from '@/db'
import { contacts } from '@/db/schema'
import { error } from 'console'

const signupSchema = z.object({
    firstName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    lastName: z.string().min(3, 'El apellido debe tener al menos 3 caracteres'),
    email: z.string().email('Ingresa un correo válido'),
    phone: z.number().min(8, 'El teléfono debe tener al menos 8 dígitos'),
    countryCode: z.number().min(1, 'El código de país es obligatorio'),
    status: z.string().min(2, 'El estado es obligatorio'),
    priority: z.number().min(1, 'La prioridad es obligatoria')
})

export async function createContactAction(
    prevState: unknown,
    formData: FormData
) {
    const validateFields = signupSchema.safeParse({
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: Number(formData.get('phone')),
        countryCode: Number(formData.get('countryCode')),
        status: formData.get('status'),
        priority: Number(formData.get('priority'))
    })
    if (!validateFields.success) {
        return {
            success: false,
            error: validateFields.error.issues
                .map((err) => err.message)
                .join(', ')
        }
    }
    const { firstName, lastName, email, phone, countryCode, status, priority } =
        validateFields.data
    try {
        const session = await auth.api.getSession({ headers: await headers() })
        if (!session) {
            return {
                success: false,
                error: 'No autorizado'
            }
        }
        await db.insert(contacts).values({
            firstName,
            lastName,
            email,
            phone: String(phone),
            countryCode: String(countryCode),
            status,
            priority: Number(priority),
            assignedTo: session.user.id as string
        })

        return { success: true, error: null }
    } catch (err) {
        console.error('Better Auth error:', err)

        // 🔥 Cualquier otro error
        return {
            success: false,
            error: 'Error inesperado. Intenta de nuevo.'
        }
    }
}
