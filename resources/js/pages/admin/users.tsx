'use client';

import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
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

export default function Users({ users = [] }: UsersPageProps) {
    const [usersList, setUsersList] = useState<User[]>(users);

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
                description: 'Failed to update user role',
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management | Akhdani" />

            <div className="p-6">
                <Heading title="User Management" description="Manage user accounts and roles" />

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {usersList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-4 text-center">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                usersList.map((user) => (
                                    <TableRow key={user.id}>
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
                                        <TableCell>
                                            <Button variant="outline" size="sm">
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
