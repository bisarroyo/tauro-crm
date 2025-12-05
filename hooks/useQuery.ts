'use client'
import { useQuery } from '@tanstack/react-query'

export function useContacts({
    page = 1,
    per_page = 15,
    q = '',
    status = '',
    assignedTo = ''
}) {
    const qs = new URLSearchParams({
        page: String(page),
        per_page: String(per_page)
    })
    if (q) qs.set('q', q)
    if (status) qs.set('status', status)
    if (assignedTo) qs.set('assignedTo', assignedTo)

    return useQuery({
        queryKey: ['contacts', page, per_page, q, status, assignedTo],
        queryFn: async () => {
            const res = await fetch(`/api/contacts/list?${qs.toString()}`)
            if (!res.ok) throw new Error('Error loading contacts')
            return res.json()
        },
        staleTime: 60 * 1000
    })
}
