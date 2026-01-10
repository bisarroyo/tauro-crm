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
import { AlertCircleIcon, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type ContactCsv = {
    firstName: string
    lastName: string
    email: string
    phone: string
    countryCode: string
    hasError: boolean
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

                        const hasError =
                            !firstName ||
                            !lastName ||
                            !email ||
                            !phone ||
                            !countryCode

                        return {
                            firstName,
                            lastName,
                            email,
                            countryCode,
                            phone,
                            hasError
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

    const updateField = (
        index: number,
        field: keyof ContactCsv,
        value: string
    ) => {
        setRows((prev) => {
            const updated = [...prev]
            updated[index] = {
                ...updated[index],
                [field]: value
            }

            const r = updated[index]
            updated[index].hasError =
                !r.firstName ||
                !r.lastName ||
                !r.email ||
                !r.phone ||
                !r.countryCode

            return updated
        })
    }

    return (
        <Card className='w-full mx-auto'>
            <CardHeader>
                <CardTitle>Importar contactos vía CSV</CardTitle>
            </CardHeader>

            <CardContent className='space-y-4'>
                <div className='flex items-center gap-3'>
                    <Input type='file' accept='.csv' onChange={handleFile} />
                    <Upload className='w-5 h-5' />
                </div>

                {error && <div className='text-red-500 text-sm'>{error}</div>}
                {rows.some((r) => r.hasError) && (
                    <Alert variant='destructive'>
                        <AlertCircleIcon />
                        <AlertTitle>No se puede procesar el archivo</AlertTitle>
                        <AlertDescription>
                            Hay filas con datos incompletos. Revisa las filas
                            marcadas en rojo.
                        </AlertDescription>
                    </Alert>
                )}

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
                                    <TableRow
                                        key={i}
                                        className={cn(
                                            r.hasError && 'text-red-500'
                                        )}>
                                        <TableCell>
                                            <Input
                                                value={r.firstName}
                                                onChange={(e) =>
                                                    updateField(
                                                        i,
                                                        'firstName',
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Input
                                                value={r.lastName}
                                                onChange={(e) =>
                                                    updateField(
                                                        i,
                                                        'lastName',
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Input
                                                value={r.email}
                                                onChange={(e) =>
                                                    updateField(
                                                        i,
                                                        'email',
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                className='w-20'
                                                value={r.countryCode}
                                                onChange={(e) =>
                                                    updateField(
                                                        i,
                                                        'countryCode',
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Input
                                                value={r.phone}
                                                onChange={(e) =>
                                                    updateField(
                                                        i,
                                                        'phone',
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </TableCell>
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
                        disabled={loading || rows.some((r) => r.hasError)}>
                        {loading
                            ? 'Subiendo...'
                            : `Importar ${rows.length} contactos`}
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}
