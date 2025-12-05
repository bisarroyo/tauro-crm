import { db } from '@/db'
import { chats, messages } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: Request) {
    const url = new URL(req.url)
    const mode = url.searchParams.get('hub.mode')
    const token = url.searchParams.get('hub.verify_token')
    const challenge = url.searchParams.get('hub.challenge')

    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
        return new Response(challenge)
    }

    return new Response('Forbidden', { status: 403 })
}

export async function POST(req: Request) {
    const body = await req.json()

    const entry = body.entry?.[0]?.changes?.[0]?.value
    const message = entry?.messages?.[0]

    if (!message) return Response.json({ status: 'no_message' })

    const phone = message.from
    const text = message.text?.body ?? ''
    const timestamp = Number(message.timestamp) * 1000

    // Crear o encontrar chat
    let chat = await db.query.chats.findFirst({
        where: eq(chats.phone, phone)
    })

    if (!chat) {
        const inserted = await db
            .insert(chats)
            .values({
                phone,
                lastMessage: text
            })
            .returning()
        chat = inserted[0]
    } else {
        await db
            .update(chats)
            .set({ lastMessage: text, updatedAt: new Date() })
            .where(eq(chats.id, chat.id))
    }

    // Guardar mensaje
    await db.insert(messages).values({
        chatId: chat.id,
        fromMe: false,
        body: text,
        timestamp
    })

    return Response.json({ success: true })
}
