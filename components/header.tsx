'use client'
import { ModeToggle } from '@/components/ui/mode-toggle' // si ya tienes un switch de tema

export function Header({ children }: { children: React.ReactNode }) {
    return (
        <header
            className='
            flex h-14 align-center justify-between px-4 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12
        backdrop-blur-xl bg-white/10 dark:bg-neutral-900/10
        border-b border-white/20 dark:border-neutral-700/20
        shadow-lg
        supports-backdrop-filter:backdrop-blur-lg
      '>
            {children}
            <div className='flex items-center gap-3'>
                {/* Theme Toggle */}
                <ModeToggle />
            </div>
        </header>
    )
}
