'use client';

import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, User } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '/admin/users',
    },
];

interface UsersPageProps {
    users: User[];
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 'All'] as const;
type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

export default function Users({ users = [] }: UsersPageProps) {
    const [usersList, setUsersList] = useState<User[]>(users);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState<PageSize>(10);

    const filteredUsers = useMemo(() => {
        return usersList.filter(
            (user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }, [usersList, searchTerm]);

    const totalItems = filteredUsers.length;
    const totalPages = pageSize === 'All' ? 1 : Math.ceil(totalItems / pageSize);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, pageSize]);

    const currentItems = useMemo(() => {
        if (pageSize === 'All') return filteredUsers;

        const startIndex = (currentPage - 1) * pageSize;
        return filteredUsers.slice(startIndex, startIndex + pageSize);
    }, [filteredUsers, currentPage, pageSize]);

    const handleRoleChange = async (userId: number, newRole: string) => {
        try {
            router.patch(
                route('admin.users.updateRole', userId),
                { role: newRole },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setUsersList((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, role: newRole } : user)));
                        toast.success('Role updated', {
                            description: `User role has been updated to ${newRole}`,
                        });
                    },
                    onError: (errors) => {
                        toast.error('Error', {
                            description: 'Failed to update user role',
                        });
                        console.error(errors);
                    },
                },
            );
        } catch (error) {
            toast.error('Error', {
                description: 'Failed to update user role' + error,
            });
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (value: string) => {
        setPageSize(value === 'All' ? 'All' : (Number(value) as PageSize));
        setCurrentPage(1);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management | Akhdani" />

            <div className="space-y-6 p-6">
                <Heading title="User Management" description="Manage user accounts and roles" />

                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                    <div className="relative w-full max-w-sm flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                        <Input
                            placeholder="Search users by name, username, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    {searchTerm && (
                        <Button variant="ghost" size="sm" onClick={() => setSearchTerm('')} className="text-muted-foreground">
                            Clear
                        </Button>
                    )}
                    <div className="ml-auto flex items-center gap-2">
                        <span className="text-sm whitespace-nowrap text-muted-foreground">Show:</span>
                        <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
                            <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="10" />
                            </SelectTrigger>
                            <SelectContent>
                                {PAGE_SIZE_OPTIONS.map((size) => (
                                    <SelectItem key={size} value={String(size)}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-semibold">Name</TableHead>
                                <TableHead className="font-semibold">Username</TableHead>
                                <TableHead className="font-semibold">Email</TableHead>
                                <TableHead className="font-semibold">Role</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentItems.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                                        {searchTerm ? `No users found matching "${searchTerm}"` : 'No users found'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                currentItems.map((user) => (
                                    <TableRow key={user.id} className="hover:bg-muted/50">
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Select defaultValue={user.role || 'PEGAWAI'} onValueChange={(value) => handleRoleChange(user.id, value)}>
                                                <SelectTrigger className="w-40">
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="PEGAWAI">Pegawai</SelectItem>
                                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                                    <SelectItem value="DIVISI-SDM">Divisi SDM</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {filteredUsers.length > 0 && pageSize !== 'All' && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {Math.min((currentPage - 1) * Number(pageSize) + 1, totalItems)} to{' '}
                            {Math.min(currentPage * Number(pageSize), totalItems)} of {totalItems} entries
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Previous Page</span>
                            </Button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handlePageChange(page)}
                                    className="h-8 w-8 p-0"
                                >
                                    {page}
                                </Button>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                                <span className="sr-only">Next Page</span>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
