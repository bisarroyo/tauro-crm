'use client'

import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { useState } from 'react'
import EditContactModal from '@/components/edit-contact-dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'

// Nuevo componente que usa useQuery (debe estar dentro del Provider)
export default function ContactsContainer() {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [debouncedSearch] = useDebounce(search, 500)

    const [selected, setSelected] = useState<Set<string>>(new Set())

    const toggleOne = (id: string) => {
        setSelected((prev) => {
            const copy = new Set(prev)
            if (copy.has(id)) copy.delete(id)
            else copy.add(id)
            return copy
        })
    }

    // Nuevo: tamaño de página seleccionable
    const [pageSize, setPageSize] = useState<number>(10)

    const { data, isLoading } = useQuery({
        queryKey: ['contacts', page, pageSize, debouncedSearch],
        queryFn: async () => {
            const res = await fetch(
                `/api/contacts/list?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(debouncedSearch)}`
            )
            if (!res.ok) {
                return { items: [], total: 0 }
            }
            const payload = await res.json()
            // Soportar respuestas: array simple o objeto { items, total } o { data, total }
            const items = Array.isArray(payload)
                ? payload
                : (payload.items ?? payload.data ?? [])
            const total =
                payload.total ??
                (Array.isArray(payload) ? payload.length : items.length)
            return { items, total }
        }
    })

    const items: ContactType[] = data?.items ?? []
    const total: number = data?.total ?? 0
    const totalPages = Math.max(1, Math.ceil(total / pageSize))

    return (
        <div className=''>
            <div className='flex gap-3 mb-4 items-center'>
                <input
                    className='border p-2 rounded w-80'
                    placeholder='Buscar...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* Select shadcn para pageSize */}
                <div className='ml-auto flex items-center gap-2'>
                    <span className='text-sm text-muted-foreground'>
                        Mostrar:
                    </span>
                    <Select
                        onValueChange={(v) => {
                            const val = Number(v)
                            setPageSize(val)
                            setPage(1) // resetear página al cambiar tamaño
                        }}
                        value={String(pageSize)}>
                        <SelectTrigger className='w-28'>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='10'>10</SelectItem>
                            <SelectItem value='25'>25</SelectItem>
                            <SelectItem value='50'>50</SelectItem>
                            <SelectItem value='100'>100</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {isLoading ? (
                <>
                    <div className='mb-2 text-sm text-muted-foreground'>
                        Cargando...
                    </div>
                    <div className='flex gap-2 flex-col'>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className='w-full'>
                                <div>
                                    <Skeleton className='h-5 w-1/4 rounded-md mb-1' />
                                </div>
                                <Skeleton
                                    key={i}
                                    className='h-12 w-full rounded-md mb-2'
                                />
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <div className='mb-2 text-sm text-muted-foreground'>
                        Mostrando {items.length} de {total} contactos
                    </div>

                    <Table>
                        <TableCaption>Mostrando contactos</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <Checkbox />
                                </TableHead>

                                <TableHead className='w-[500px]'>
                                    Nombre
                                </TableHead>
                                <TableHead>Correo</TableHead>
                                <TableHead>Teléfono</TableHead>
                                <TableHead className='text-right'>
                                    Acciones
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.isArray(items)
                                ? items.map((c: ContactType, idx: number) => (
                                      <TableRow key={c?.id ?? idx}>
                                          <TableCell>
                                              <Checkbox />
                                          </TableCell>
                                          <TableCell className='p-3'>
                                              {c?.firstName ?? ''}{' '}
                                              {c?.lastName ?? ''}
                                          </TableCell>
                                          <TableCell>
                                              {c?.email ?? ''}
                                          </TableCell>
                                          <TableCell>
                                              {c?.phone ?? ''}
                                          </TableCell>
                                          <TableCell className='flex justify-end'>
                                              <EditContactModal contact={c} />
                                          </TableCell>
                                      </TableRow>
                                  ))
                                : null}
                        </TableBody>
                    </Table>

                    {/* Paginación simple con shadcn Button */}
                    <div className='flex items-center justify-between mt-4'>
                        <div className='flex items-center gap-2'>
                            <Button
                                variant='outline'
                                disabled={page <= 1}
                                onClick={() =>
                                    setPage((p) => Math.max(1, p - 1))
                                }>
                                Anterior
                            </Button>

                            <span className='px-2'>
                                Página {page} / {totalPages}
                            </span>

                            <Button
                                variant='outline'
                                disabled={page >= totalPages}
                                onClick={() =>
                                    setPage((p) => Math.min(totalPages, p + 1))
                                }>
                                Siguiente
                            </Button>
                        </div>

                        {/* Opcional: salto rápido a página */}
                        <div className='flex items-center gap-2'>
                            <span className='text-sm text-muted-foreground'>
                                Ir a
                            </span>
                            <select
                                className='border rounded p-1'
                                value={String(page)}
                                onChange={(e) => {
                                    const v = Number(e.target.value)
                                    if (!Number.isNaN(v))
                                        setPage(
                                            Math.min(Math.max(1, v), totalPages)
                                        )
                                }}>
                                {Array.from({ length: totalPages }).map(
                                    (_, i) => (
                                        <option key={i} value={i + 1}>
                                            {i + 1}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
