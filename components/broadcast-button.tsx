'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RadioTower } from 'lucide-react'
import { BroadcastDialog } from '@/components/broadcast-dialog'

export default function BroadcastButton() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button
                size='icon'
                variant='ghost'
                onClick={() => setOpen(true)}
                title='Broadcast Message'>
                <RadioTower className='w-5 h-5' />
            </Button>
            <BroadcastDialog open={open} onOpenChange={setOpen} />
        </>
    )
}
