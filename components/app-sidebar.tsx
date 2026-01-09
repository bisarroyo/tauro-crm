'use client'
import * as React from 'react'
import {
    BookOpen,
    Cog,
    MessagesSquare,
    PieChart,
    Settings2,
    Tag,
    UsersRound
} from 'lucide-react'
import { NavMain } from '@/components/nav-main'
import { NavProjects } from '@/components/nav-projects'
import { NavUser } from '@/components/nav-user'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarRail
} from '@/components/ui/sidebar'

import { useSession } from '@/hooks/useSession'

const data = {
    navMain: [
        {
            title: 'Leads',
            url: '#',
            icon: UsersRound,
            isActive: true,
            items: [
                {
                    title: 'Leads',
                    url: '/contacts'
                },
                {
                    title: 'Buscar Leads',
                    url: '/contacts/search'
                },
                {
                    title: 'Cargar Leads',
                    url: '/contacts/import'
                },
                {
                    title: 'Crear lead',
                    url: '/contacts/create'
                }
            ]
        },
        {
            title: 'Chats',
            url: '#',
            icon: MessagesSquare,
            items: [
                {
                    title: 'Chats',
                    url: '/chats'
                },
                {
                    title: 'Crear chat AI',
                    url: '/chats/new'
                }
            ]
        },
        {
            title: 'Documentación',
            url: '#',
            icon: BookOpen,
            items: [
                {
                    title: 'Introducción',
                    url: '#'
                }
            ]
        },
        {
            title: 'Configuración',
            url: '#',
            icon: Settings2,
            items: [
                {
                    title: 'Tags',
                    url: '/tags'
                },
                {
                    title: 'Campañas',
                    url: '/campaigns'
                }
            ]
        }
    ],
    chats: [
        {
            name: 'AI tags',
            url: '/tags',
            icon: Tag
        },
        {
            name: 'Ajustes',
            url: '#',
            icon: Cog
        },
        {
            name: 'Reportes',
            url: '#',
            icon: PieChart
        }
    ]
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const session = useSession()
    return (
        <Sidebar collapsible='icon' {...props}>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProjects projects={data.chats} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={session} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
