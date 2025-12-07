'use client'

import { Header } from '@/components/header'
import {
    SidebarProvider,
    SidebarTrigger,
    SidebarInset
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

export default function LayoutSidebar({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className=''>
                    <Header>
                        <div className='flex items-center gap-2'>
                            <SidebarTrigger className='-ml-1' />
                        </div>
                    </Header>
                </div>
                <main className='min-h-screen w-full md:p-4'>{children}</main>
            </SidebarInset>
        </SidebarProvider>
    )
}
