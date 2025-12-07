'use client'
import * as React from 'react'
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    GalleryVerticalEnd,
    Map,
    MessageSquareText,
    PieChart,
    Settings2,
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
    teams: [
        {
            name: 'Acme Inc',
            logo: GalleryVerticalEnd,
            plan: 'Enterprise'
        },
        {
            name: 'Acme Corp.',
            logo: AudioWaveform,
            plan: 'Startup'
        },
        {
            name: 'Evil Corp.',
            logo: Command,
            plan: 'Free'
        }
    ],
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
                    url: '/clients/import'
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
            icon: Bot,
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
            name: 'Conversaciones',
            url: '/chats',
            icon: MessageSquareText
        },
        {
            name: 'Sales & Marketing',
            url: '#',
            icon: PieChart
        },
        {
            name: 'Travel',
            url: '#',
            icon: Map
        }
    ]
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const session = useSession()
    console.log(session)
    return (
        <Sidebar collapsible='icon' {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
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
