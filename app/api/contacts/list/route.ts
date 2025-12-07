import { auth } from '@/lib/auth'
import { db } from '@/db'
import { contacts } from '@/db/schema'
import { eq, like, and } from 'drizzle-orm'

export async function GET(req: Request) {
    const session = await auth.api.getSession({ headers: req.headers })
    const seeAllContacts = await auth.api.userHasPermission({
        body: {
            userId: session?.user.id || '',
            permission: {
                leads: ['create', 'update', 'delete', 'view']
            } /* Must use this, or permissions */
        }
    })
    if (!session) return new Response('Unauthorized', { status: 401 })

    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page') ?? '1')
    const limit = Number(searchParams.get('limit') ?? '10')
    const search = searchParams.get('search') ?? ''

    console.log(seeAllContacts)

    if (seeAllContacts.success) {
        const data = await db
            .select()
            .from(contacts)
            .where(like(contacts.firstName, `%${search}%`))
            .limit(limit)
            .offset((page - 1) * limit)

        return Response.json(data)
    }

    const data = await db
        .select()
        .from(contacts)
        .where(
            and(
                eq(contacts.assignedTo, session.user.id),
                like(contacts.firstName, `%${search}%`)
            )
        )
        .limit(limit)
        .offset((page - 1) * limit)

    return Response.json(data)
}

export async function POST(req: Request) {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session) return new Response('Unauthorized', { status: 401 })

    const body = await req.json()

    await db.insert(contacts).values({
        id: crypto.randomUUID(),
        ...body
    })

    return Response.json({ success: true })
}
