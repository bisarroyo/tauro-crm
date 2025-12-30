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
import { TeamSwitcher } from '@/components/team-switcher'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
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
                    url: 'dashboard/chats'
                },
                {
                    title: 'Crear chat AI',
                    url: 'dashboard/chats/new'
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
                },
                {
                    title: 'Get Started',
                    url: '#'
                },
                {
                    title: 'Tutorials',
                    url: '#'
                },
                {
                    title: 'Changelog',
                    url: '#'
                }
            ]
        },
        {
            title: 'Settings',
            url: '#',
            icon: Settings2,
            items: [
                {
                    title: 'General',
                    url: '#'
                },
                {
                    title: 'Team',
                    url: '#'
                },
                {
                    title: 'Billing',
                    url: '#'
                },
                {
                    title: 'Limits',
                    url: '#'
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
    console.log(session)
    return (
        <Sidebar collapsible='icon' {...props}>
            <SidebarHeader>
                <TeamSwitcher />
            </SidebarHeader>
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
