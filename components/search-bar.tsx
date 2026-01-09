'use client'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { Input } from '@/components/ui/input'
import { useEffect, useRef, useState } from 'react'
import { contacts } from '@/db/schema'
import { InferSelectModel } from 'drizzle-orm'
import Link from 'next/link'

import { Copy, CopyCheck, MessageCircleMore } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemTitle
} from '@/components/ui/item'

import { ScrollArea } from '@/components/ui/scroll-area'

import { copyToClipboard } from '@/lib/utils'

type Contact = InferSelectModel<typeof contacts>

export default function SearchBar() {
    const [search, setSearch] = useState('')
    const [searching, setSearching] = useState(false)
    const [debouncedSearch] = useDebounce(search, 500)
    const [copied, setCopied] = useState(false)

    const searchInput = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (searchInput.current) {
            searchInput.current.focus()
        }
    }, [])

    const handleCopy = (text: string) => {
        copyToClipboard(text)
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 2000)
    }

    const query = useQuery({
        queryKey: ['search-data', debouncedSearch],
        queryFn: async () => {
            if (!debouncedSearch) return []
            setSearching(true)
            const res = await fetch(
                `/api/contacts/list?search=${encodeURIComponent(debouncedSearch)}`
            )
            if (!res.ok) {
                return []
            }
            setSearching(false)
            return res.json()
        },
        enabled: debouncedSearch.length > 0
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    return (
        <div className=''>
            <Input
                type='text'
                placeholder='Buscar leads...'
                className='w-full mb-2'
                value={search}
                onChange={handleChange}
                ref={searchInput}
            />
            {!searching && query.data && query.data.length > 0 && (
                <ScrollArea className='w-full h-[calc(100dvh-10rem)]'>
                    {query.data.map((contact: Contact) => (
                        <Item
                            variant='outline'
                            key={contact.id}
                            className='mb-2'>
                            <ItemContent>
                                <ItemTitle>
                                    <Link
                                        href={`/contacts/${contact.id}`}
                                        key={contact.id}
                                        className=''>
                                        {contact.firstName} {contact.lastName}
                                    </Link>
                                </ItemTitle>
                                <ItemDescription className='flex items-center gap-2'>
                                    {contact.email}
                                    {copied ? (
                                        <Button
                                            variant='ghost'
                                            className='hover:bg-transparent'
                                            onClick={() =>
                                                handleCopy(contact.email)
                                            }>
                                            <CopyCheck
                                                color='green'
                                                size={16}
                                            />
                                        </Button>
                                    ) : (
                                        <Button
                                            variant='ghost'
                                            onClick={() =>
                                                handleCopy(contact.email)
                                            }>
                                            <Copy size={16} />
                                        </Button>
                                    )}
                                </ItemDescription>
                                <ItemDescription className='flex items-center gap-2'>
                                    <Link
                                        className='flex items-center gap-2'
                                        target='_blank'
                                        href={`https://wa.me/${contact.countryCode}${contact.phone}`}>
                                        +{contact.countryCode}
                                        {contact.phone}
                                        <MessageCircleMore size={16} />
                                    </Link>
                                </ItemDescription>
                            </ItemContent>
                            <ItemActions>
                                <Button variant='outline' size='sm'>
                                    Editar
                                </Button>
                            </ItemActions>
                        </Item>
                    ))}
                </ScrollArea>
            )}
            {(query.isLoading || searching) && debouncedSearch ? (
                <div className=''>
                    <p>Buscando...</p>
                </div>
            ) : (
                <div className=''>
                    <p>No hay resultados</p>
                </div>
            )}
        </div>
    )
}
