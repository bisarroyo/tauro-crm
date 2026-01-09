import { MessageSquare } from 'lucide-react'

export default function ChatsPage() {
    return (
        <div className='flex flex-col items-center justify-center h-full text-muted-foreground'>
            <MessageSquare className='w-16 h-16 mb-4 opacity-20' />
            <h2 className='text-xl font-medium mb-2'>WhatsApp Chats</h2>
            <p>Select a chat from the sidebar to start messaging.</p>
        </div>
    )
}
