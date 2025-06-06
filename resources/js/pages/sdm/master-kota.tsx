'use client';

import type React from 'react';

import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import Heading from '@/components/heading';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { Kota } from '@/types';

interface MasterKotaProps {
    kotas: Kota[];
}

type FormState = {
    id?: number;
    nama: string;
    latitude: number | '';
    longitude: number | '';
    provinsi: string;
    pulau: string;
    luar_negeri: boolean;
};

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 'All'] as const;
type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

export default function MasterKota({ kotas = [] }: MasterKotaProps) {
    const [kotaList, setKotaList] = useState<Kota[]>(kotas);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [kotaToDelete, setKotaToDelete] = useState<number | null>(null);
    const [form, setForm] = useState<FormState>({
        nama: '',
        latitude: '',
        longitude: '',
        provinsi: '',
        pulau: '',
        luar_negeri: false,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState<PageSize>(10);

    const filteredKotas = useMemo(() => {
        return kotaList.filter(
            (kota) =>
                kota.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                kota.provinsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                kota.pulau.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }, [kotaList, searchTerm]);

    const totalItems = filteredKotas.length;
    const totalPages = pageSize === 'All' ? 1 : Math.ceil(totalItems / pageSize);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, pageSize]);

    const currentItems = useMemo(() => {
        if (pageSize === 'All') return filteredKotas;

        const startIndex = (currentPage - 1) * pageSize;
        return filteredKotas.slice(startIndex, startIndex + pageSize);
    }, [filteredKotas, currentPage, pageSize]);

    const openAddModal = () => {
        setIsEditing(false);
        setForm({
            nama: '',
            latitude: '',
            longitude: '',
            provinsi: '',
            pulau: '',
            luar_negeri: false,
        });
        setModalOpen(true);
    };

    const openEditModal = (kota: Kota) => {
        setIsEditing(true);
        setForm({
            id: kota.id,
            nama: kota.nama,
            latitude: kota.latitude,
            longitude: kota.longitude,
            provinsi: kota.provinsi,
            pulau: kota.pulau,
            luar_negeri: kota.luar_negeri,
        });
        setModalOpen(true);
    };

    const openDeleteDialog = (id: number) => {
        setKotaToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleCheckboxChange = (checked: boolean) => {
        setForm((prev) => ({
            ...prev,
            luar_negeri: checked,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payload = {
            nama: form.nama,
            latitude: Number(form.latitude),
            longitude: Number(form.longitude),
            provinsi: form.provinsi,
            pulau: form.pulau,
            luar_negeri: form.luar_negeri,
        };

        try {
            if (isEditing && form.id) {
                await router.put(route('master.kota.update', form.id), payload, {
                    onSuccess: () => {
                        toast.success('Kota updated successfully');
                        setModalOpen(false);
                        router.visit(window.location.href, { preserveState: false, preserveScroll: true });
                    },
                    onError: (errors) => {
                        toast.error('Update error:', errors);
                    },
                });
            } else {
                await router.post(route('master.kota.store'), payload, {
                    onSuccess: () => {
                        toast.success('Kota created successfully');
                        setModalOpen(false);
                        router.visit(window.location.href, { preserveState: false, preserveScroll: true });
                    },
                    onError: (errors) => {
                        toast.error('Create error:', errors);
                    },
                });
            }
        } catch (error) {
            // nothing
            console.error('Error submitting form:', error);
        }
    };

    const handleDelete = async () => {
        if (!kotaToDelete) return;

        try {
            await router.delete(route('master.kota.destroy', kotaToDelete), {
                preserveScroll: true,
                onSuccess: () => {
                    setKotaList((prev) => prev.filter((k) => k.id !== kotaToDelete));
                    toast.success('Kota deleted successfully');
                    setDeleteDialogOpen(false);
                    setKotaToDelete(null);
                },
                onError: () => {
                    toast.error('Failed to delete kota');
                },
            });
        } catch {
            toast.error('Failed to delete kota');
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
        <AppLayout>
            <Head title="Master Kota | Akhdani" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading title="Master Kota" description="Manage city data" />
                    <Button onClick={openAddModal} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add New Kota
                    </Button>
                </div>

                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                    <div className="relative w-full max-w-sm flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                        <Input
                            placeholder="Search cities, provinces, or islands..."
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
                                <TableHead className="font-semibold">Nama Kota</TableHead>
                                <TableHead className="font-semibold">Provinsi</TableHead>
                                <TableHead className="font-semibold">Pulau</TableHead>
                                <TableHead className="font-semibold">Luar Negeri</TableHead>
                                <TableHead className="font-semibold">Latitude</TableHead>
                                <TableHead className="font-semibold">Longitude</TableHead>
                                <TableHead className="text-center font-semibold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentItems.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                                        {searchTerm
                                            ? `No cities found matching "${searchTerm}"`
                                            : 'No kota found. Click "Add New Kota" to get started.'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                currentItems.map((kota) => (
                                    <TableRow key={kota.id} className="hover:bg-muted/50">
                                        <TableCell className="font-medium">{kota.nama}</TableCell>
                                        <TableCell>{kota.provinsi}</TableCell>
                                        <TableCell>{kota.pulau}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                    kota.luar_negeri
                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                }`}
                                            >
                                                {kota.luar_negeri ? 'Yes' : 'No'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">{kota.latitude.toFixed(7)}</TableCell>
                                        <TableCell className="font-mono text-sm">{kota.longitude.toFixed(7)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openEditModal(kota)}
                                                    className="flex items-center gap-1"
                                                >
                                                    <Edit className="h-3 w-3" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => openDeleteDialog(kota.id)}
                                                    className="flex items-center gap-1"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {filteredKotas.length > 0 && pageSize !== 'All' && (
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

                {/* Add/Edit Dialog */}
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>{isEditing ? 'Edit Kota' : 'Add New Kota'}</DialogTitle>
                            <DialogDescription>
                                {isEditing ? 'Update the city information below.' : 'Enter the details for the new city.'}
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nama">Nama Kota *</Label>
                                <Input id="nama" name="nama" value={form.nama} onChange={handleChange} placeholder="Enter city name" required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="latitude">Latitude *</Label>
                                    <Input
                                        id="latitude"
                                        name="latitude"
                                        type="number"
                                        value={form.latitude}
                                        onChange={handleChange}
                                        placeholder="e.g., -6.2088"
                                        step="any"
                                        min={-90}
                                        max={90}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="longitude">Longitude *</Label>
                                    <Input
                                        id="longitude"
                                        name="longitude"
                                        type="number"
                                        value={form.longitude}
                                        onChange={handleChange}
                                        placeholder="e.g., 106.8456"
                                        step="any"
                                        min={-180}
                                        max={180}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="provinsi">Provinsi *</Label>
                                <Input
                                    id="provinsi"
                                    name="provinsi"
                                    value={form.provinsi}
                                    onChange={handleChange}
                                    placeholder="Enter province name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pulau">Pulau *</Label>
                                <Input id="pulau" name="pulau" value={form.pulau} onChange={handleChange} placeholder="Enter island name" required />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="luar_negeri" checked={form.luar_negeri} onCheckedChange={handleCheckboxChange} />
                                <Label htmlFor="luar_negeri" className="text-sm font-normal">
                                    Luar Negeri (Foreign Country)
                                </Label>
                            </div>

                            <DialogFooter className="gap-2">
                                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">{isEditing ? 'Update Kota' : 'Create Kota'}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription className="space-y-2">
                                <p>This action cannot be undone.</p>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setKotaToDelete(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">
                                Delete Kota
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
