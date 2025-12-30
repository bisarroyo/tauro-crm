'use client'
import { useQuery } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export default function SearchBar() {
    const [search, setSearch] = useState('')
    const query = useQuery({
        queryKey: ['search-data'],
        queryFn: async () => {
            const res = await fetch('/api/contacts')
            if (!res.ok) {
                return []
            }
            return res.json()
        }
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }
    return (
        <div className='w-96'>
            <Input
                type='text'
                placeholder='Buscar leads...'
                className='w-full'
                value={search}
                onChange={handleChange}
            />
        </div>
    )
}
