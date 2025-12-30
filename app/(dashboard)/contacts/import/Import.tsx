'use client'

import { useState } from 'react'
import Papa from 'papaparse'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Upload } from 'lucide-react'

type ContactCsv = {
    firstName: string
    lastName: string
    email: string
    phone: string
    countryCode: string
}

export default function CsvContactUploader({
    onImport,
    loading
}: {
    onImport: (rows: ContactCsv[]) => void
    loading: boolean
}) {
    const [rows, setRows] = useState<ContactCsv[]>([])
    const [error, setError] = useState('')

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const parsed = results.data as Record<string, string>[]

                const mapped: ContactCsv[] = parsed
                    .map((row) => {
                        const firstName = row['Name']?.trim() ?? ''
                        const lastName = row['Family Name']?.trim() ?? ''
                        const email = row['Email']?.trim() ?? ''
                        const countryCode =
                            row['Country']?.trim() === 'Costa Rica' ? '506' : ''
                        const phone = row['Phone']?.trim().slice(4) ?? ''

                        if (
                            !firstName &&
                            !lastName &&
                            !email &&
                            !countryCode &&
                            !phone
                        )
                            return null

                        return {
                            firstName,
                            lastName,
                            email,
                            countryCode,
                            phone
                        }
                    })
                    .filter(Boolean) as ContactCsv[]

                if (mapped.length === 0) {
                    setError('No se encontraron columnas válidas en el CSV.')
                    return
                }

                setError('')
                setRows(mapped)
            }
        })
    }

    return (
        <Card className='w-full max-w-2xl mx-auto'>
            <CardHeader>
                <CardTitle>Importar contactos vía CSV</CardTitle>
            </CardHeader>

            <CardContent className='space-y-4'>
                <div className='flex items-center gap-3'>
                    <Input type='file' accept='.csv' onChange={handleFile} />
                    <Upload className='w-5 h-5' />
                </div>

                {error && <div className='text-red-500 text-sm'>{error}</div>}

                {rows.length > 0 && (
                    <div className='border rounded-lg overflow-hidden'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Apellidos</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Código país</TableHead>
                                    <TableHead>Teléfono</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map((r, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{r.firstName}</TableCell>
                                        <TableCell>{r.lastName}</TableCell>
                                        <TableCell>{r.email}</TableCell>
                                        <TableCell>{r.countryCode}</TableCell>
                                        <TableCell>{r.phone}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {rows.length > 0 && (
                    <Button
                        className='w-full'
                        onClick={() => onImport(rows)}
                        disabled={loading}>
                        {loading
                            ? 'Subiendo...'
                            : `Importar ${rows.length} contactos`}
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}
