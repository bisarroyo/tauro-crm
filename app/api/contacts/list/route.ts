import { NextResponse } from 'next/server'
import { db } from '@/db'
import { contacts } from '@/db/schema'
import { auth } from '@/lib/auth'
import { eq } from 'drizzle-orm'

export async function GET() {
    const session = await auth.api.getSession()
    if (!session)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const inserted = await db
        .select()
        .from(contacts)
        .where(eq(contacts.assignedTo, session.user.id))

    return NextResponse.json(inserted[0])
}
