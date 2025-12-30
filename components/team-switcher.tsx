'use client'

import * as React from 'react'
import { Database } from 'lucide-react'

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar'

export function TeamSwitcher() {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    className='data-[slot=sidebar-menu-button]:!p-1.5'>
                    <a href='#'>
                        <Database className='!size-5' />
                        <span className='text-base font-semibold'>
                            Acme Inc.
                        </span>
                    </a>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
