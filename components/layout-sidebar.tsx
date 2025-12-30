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
                <div className='fixed top-0 left-0 right-0 z-20 md:pl-64'>
                    <Header>
                        <div className='flex items-center gap-2'>
                            <SidebarTrigger className='-ml-1' />
                        </div>
                    </Header>
                </div>
                <main className='min-h-screen w-full md:px-8 pt-20'>
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
