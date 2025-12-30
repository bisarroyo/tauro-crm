import { NextResponse } from 'next/server'
import { db } from '@/db'
import { contacts } from '@/db/schema'
import { auth } from '@/lib/auth'

export async function POST(req: Request) {
    // 1. Validar sesión
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // 2. Obtener JSON del body
    let body
    try {
        body = await req.json()
    } catch {
        return NextResponse.json(
            { error: 'Invalid JSON format' },
            { status: 400 }
        )
    }

    // 3. Detectar si llega 1 contacto o un array
    const records = Array.isArray(body) ? body : [body]

    if (records.length === 0) {
        return NextResponse.json(
            { error: 'No contacts provided' },
            { status: 400 }
        )
    }

    // 4. Mapeo + saneamiento + validación mínima
    const sanitized: ContactType[] = []

    for (const item of records) {
        const { firstName, lastName, phone, email, countryCode, assignedTo } =
            item

        if (!firstName || !email || !countryCode || !phone) {
            return NextResponse.json(
                {
                    error: 'Each contact must include at least firstName, email, country code and phone'
                },
                { status: 400 }
            )
        }

        sanitized.push({
            firstName,
            lastName: lastName ?? '',
            phone: phone ?? '',
            email,
            countryCode,
            assignedTo: assignedTo || session.user.id
        })
    }

    // 5. Insert masivo
    try {
        const inserted = await db.insert(contacts).values(sanitized).returning()

        return NextResponse.json({
            count: inserted.length,
            inserted
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'Database error inserting contacts' },
            { status: 500 }
        )
    }
}
