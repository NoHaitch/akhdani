import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import type { NavItem, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { FileText, MapPin, Users } from 'lucide-react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const isAdmin = auth.user.role === 'ADMIN';
    const isSDM = auth.user.role === 'DIVISI-SDM' || auth.user.role === 'ADMIN';

    // Admin navigation items
    const adminItems: NavItem[] = [
        {
            title: 'User Management',
            href: '/admin/users',
            icon: Users,
        },
    ];

    // SDM navigation items
    const sdmItems: NavItem[] = [
        {
            title: 'Pengajuan Perdin',
            href: '/sdm/pengajuan-perdin',
            icon: FileText,
        },
        {
            title: 'Master Kota',
            href: '/sdm/master-kota',
            icon: MapPin,
        },
    ];

    return (
        <>
            <SidebarGroup className="px-2 py-0">
                <SidebarGroupLabel>Platform</SidebarGroupLabel>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }}>
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>

            {/* SDM section - only visible to SDM */}
            {isSDM && (
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>SDM</SidebarGroupLabel>
                    <SidebarMenu>
                        {sdmItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }}>
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            )}

            {/* Admin section - only visible to admins */}
            {isAdmin && (
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Administration</SidebarGroupLabel>
                    <SidebarMenu>
                        {adminItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }}>
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            )}
        </>
    );
}
