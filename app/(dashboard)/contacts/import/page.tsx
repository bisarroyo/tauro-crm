'use client'

import { useMutation } from '@tanstack/react-query'
import CsvContactUploader from './Import'

export default function ImportPage() {
    const { mutate, isPending, isSuccess } = useMutation({
        mutationFn: async (contacts: ContactType[]) => {
            await fetch('/api/contacts/import', {
                method: 'POST',
                body: JSON.stringify(contacts),
                headers: { 'Content-Type': 'application/json' }
            })
        }
    })

    const handleImport = (contacts: ContactType[]) => {
        mutate(contacts)
    }

    return (
        <div className='p-6'>
            <CsvContactUploader onImport={handleImport} loading={isPending} />

            {isSuccess && (
                <div className='mt-4 text-green-600'>
                    ¡Contacts imported successfully!
                </div>
            )}
        </div>
    )
}
