import { auth } from '@/lib/auth'
import { db } from '@/db'
import { contacts, contactGroups } from '@/db/schema'
import { eq, like, and, inArray, count } from 'drizzle-orm'

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
    const limit = Number(searchParams.get('pageSize') ?? '10')

    const search = searchParams.get('search') ?? ''
    const groupId = searchParams.get('groupId')
        ? Number(searchParams.get('groupId'))
        : null

    const baseWhere = and(
        seeAllContacts.success
            ? undefined
            : eq(contacts.assignedTo, session.user.id),
        like(contacts.firstName, `%${search}%`),
        groupId
            ? inArray(
                  contacts.id,
                  db
                      .select({ id: contactGroups.contactId })
                      .from(contactGroups)
                      .where(eq(contactGroups.groupId, groupId))
              )
            : undefined
    )
    const items = await db
        .select()
        .from(contacts)
        .where(baseWhere)
        .limit(limit)
        .offset((page - 1) * limit)

    const [{ total }] = await db
        .select({ total: count() })
        .from(contacts)
        .where(baseWhere)

    return Response.json({
        items,
        total
    })
}

export async function POST(req: Request) {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session) return new Response('Unauthorized', { status: 401 })

    const body = await req.json()

    await db.insert(contacts).values({
        ...body
    })

    return Response.json({ success: true })
}
