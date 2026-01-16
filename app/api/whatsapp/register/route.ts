const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN
const PIN = process.env.WHATSAPP_PIN

export async function GET(req: Request) {
    const data = await fetch(
        `https://graph.facebook.com/v24.0/977100235484845/register`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${WHATSAPP_TOKEN}`
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: '50686138495',
                type: 'text',
                text: {
                    body: 'Hola, este es un mensaje de prueba desde la API de WhatsApp Business.'
                },
                pin: PIN
            })
        }
    )
    console.log('WhatsApp API Response Status:', data.status)
    const result = await data.json()
    console.log('WhatsApp API Response Body:', result)

    return new Response('OK')
}
