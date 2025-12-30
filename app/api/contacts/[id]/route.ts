import { NextResponse } from 'next/server'
import { db } from '@/db'
import { contacts } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'

type RouteParams = {
    params: Promise<{ id: string }>
}

export async function GET(req: Request, { params }: RouteParams) {
    const { id: idParam } = await params
    const id = Number(idParam)
    const c = await db.query.contacts.findFirst({ where: eq(contacts.id, id) })
    if (!c) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(c)
}

export async function PUT(req: Request, { params }: RouteParams) {
    // proteger: debe estar logueado y ser assignedTo o admin
    const { id: idParam } = await params
    const id = Number(idParam)
    const body = await req.json()

    const session = await auth.api.getSession({ headers: req.headers })
    if (!session)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const editContacts = await auth.api.userHasPermission({
        body: {
            userId: session?.user.id || '',
            permission: {
                leads: ['update']
            }
        }
    })

    const contact = await db.query.contacts.findFirst({
        where: eq(contacts.id, id)
    })
    if (!contact)
        return NextResponse.json({ error: 'Not found' }, { status: 404 })

    if (!editContacts.success || contact.assignedTo !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await db
        .update(contacts)
        .set({
            firstName: body.firstName,
            lastName: body.lastName,
            phone: body.phone,
            email: body.email,
            status: body.status,
            notes: body.notes,
            assignedTo: body.assignedTo ?? contact.assignedTo
        })
        .where(eq(contacts.id, id))

    const updated = await db.query.contacts.findFirst({
        where: eq(contacts.id, id)
    })
    return NextResponse.json(updated)
}
