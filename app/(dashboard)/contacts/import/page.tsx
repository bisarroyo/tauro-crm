'use client'

import { useMutation } from '@tanstack/react-query'
import CsvContactUploader from './Import'
import { toast } from 'sonner'
import { redirect } from 'next/navigation'

export default function ImportPage() {
    const { mutate, isPending } = useMutation({
        mutationFn: async (contacts: ContactType[]) => {
            try {
                const response = await fetch('/api/contacts/import', {
                    method: 'POST',
                    body: JSON.stringify(contacts),
                    headers: { 'Content-Type': 'application/json' }
                })
                if (!response.ok) {
                    throw new Error((await response.json()).error)
                }
                toast.success('Contacts imported successfully')
                redirect('/contacts')
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message)
                } else {
                    toast.error('An error occurred during import')
                }
            }
        }
    })

    const handleImport = (contacts: ContactType[]) => {
        mutate(contacts)
    }

    return (
        <div className='p-6'>
            <CsvContactUploader onImport={handleImport} loading={isPending} />
        </div>
    )
}
