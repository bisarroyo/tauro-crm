'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function ChatPage() {
    const params = useParams()
    const phone = params.number as string
    const [chat, setChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')

    useEffect(() => {
        async function load() {
            const chats = await fetch('/api/chat/chats').then((r) => r.json())
            const c = chats.find((x) => x.phone === phone)
            setChat(c)

            if (c) {
                const msgs = await fetch(
                    `/api/chat/messages?chatId=${c.id}`
                ).then((r) => r.json())
                setMessages(msgs)
            }
        }
        load()
    }, [phone])

    async function sendMessage() {
        await fetch('/api/chat/reply', {
            method: 'POST',
            body: JSON.stringify({
                chatId: chat.id,
                message: input
            })
        })

        setMessages([...messages, { fromMe: true, body: input }])
        setInput('')
    }

    return (
        <div className='p-6'>
            <h2 className='text-xl mb-4'>Chat con {phone}</h2>

            <div className='h-[60vh] overflow-y-auto border p-4 rounded-xl mb-4 bg-white'>
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`mb-2 ${m.fromMe ? 'text-right' : ''}`}>
                        <span
                            className={`inline-block px-3 py-2 rounded-xl ${
                                m.fromMe
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200'
                            }`}>
                            {m.body}
                        </span>
                    </div>
                ))}
            </div>

            <div className='flex gap-2'>
                <input
                    className='flex-1 border p-3 rounded-xl'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    onClick={sendMessage}
                    className='px-4 py-2 bg-blue-600 text-white rounded-xl'>
                    Enviar
                </button>
            </div>
        </div>
    )
}
