import LayoutSidebar from '@/components/layout-sidebar'

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return <LayoutSidebar>{children}</LayoutSidebar>
}
