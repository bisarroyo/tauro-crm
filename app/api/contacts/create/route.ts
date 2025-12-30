import { NextResponse } from 'next/server'
import { db } from '@/db'
import { contacts } from '@/db/schema'
import { auth } from '@/lib/auth'

export async function POST(req: Request) {
    const session = await auth.api.getSession()
    if (!session)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { firstName, lastName, phone, email, assignedTo } = await req.json()

    const inserted = await db
        .insert(contacts)
        .values({
            firstName,
            lastName,
            phone,
            email,
            assignedTo: assignedTo ?? session.user.id
        } as ContactType)
        .returning()

    return NextResponse.json(inserted[0])
}
