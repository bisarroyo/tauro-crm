'use client'

export default function Dashboard() {
    const handleClick = async () => {
        await fetch('/api/whatsapp/register')
    }
    return <button onClick={handleClick}>Enviar</button>
}
