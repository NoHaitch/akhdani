'use client';

import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, Loader2, MapPin, Plus, Search } from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import type { Kota, Perdin } from '@/types';

interface PerdinkuProps {
    perdins: Perdin[];
}

type FormState = {
    asal_kota_id?: number;
    tujuan_kota_id?: number;
    tanggal_berangkat: string;
    tanggal_kembali: string;
    maksud_tujuan: string;
};

export default function Perdinku({ perdins = [] }: PerdinkuProps) {
    const [kotas, setKotas] = useState<Kota[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState<FormState>({
        asal_kota_id: undefined,
        tujuan_kota_id: undefined,
        tanggal_berangkat: '',
        tanggal_kembali: '',
        maksud_tujuan: '',
    });
    const [formErrors, setFormErrors] = useState<{
        cities?: string;
        dates?: string;
    }>({});

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState<PageSize>(10);

    const PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 'All'] as const;
    type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

    useEffect(() => {
        axios
            .get('/kotas')
            .then((response) => {
                setKotas(response.data);
            })
            .catch(() => {
                toast.error('Failed to load kota list');
            });
    }, []);

    useEffect(() => {
        // Clear errors when form changes
        setFormErrors({});
    }, [form.asal_kota_id, form.tujuan_kota_id, form.tanggal_berangkat, form.tanggal_kembali]);

    const openAddModal = () => {
        setForm({
            asal_kota_id: undefined,
            tujuan_kota_id: undefined,
            tanggal_berangkat: '',
            tanggal_kembali: '',
            maksud_tujuan: '',
        });
        setFormErrors({});
        setModalOpen(true);
    };

    const validateForm = (): boolean => {
        const errors: { cities?: string; dates?: string } = {};
        let isValid = true;

        // Validate cities
        if (form.asal_kota_id === form.tujuan_kota_id && form.asal_kota_id !== undefined) {
            errors.cities = 'Source and destination city must be different';
            isValid = false;
        }

        // Validate dates
        if (form.tanggal_berangkat && form.tanggal_kembali && form.tanggal_berangkat > form.tanggal_kembali) {
            errors.dates = 'Return date must be after or same as departure date';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!form.maksud_tujuan.trim()) {
            toast.error('Maksud / Tujuan is required.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Fixed field names to match Laravel backend expectations
            await router.post(
                route('perdinku.store'),
                {
                    kota_asal_id: form.asal_kota_id,
                    kota_tujuan_id: form.tujuan_kota_id,
                    tanggal_berangkat: form.tanggal_berangkat,
                    tanggal_pulang: form.tanggal_kembali,
                    maksud_tujuan: form.maksud_tujuan,
                },
                {
                    onSuccess: () => {
                        toast.success('Perdin created successfully');
                        setModalOpen(false);
                        router.visit(window.location.href, {
                            preserveState: false,
                            preserveScroll: true,
                        });
                    },
                    onError: (errors) => {
                        toast.error('Error creating Perdin');
                        console.error('Form submission errors:', errors);
                    },
                    onFinish: () => {
                        setIsSubmitting(false);
                    },
                },
            );
        } catch (error) {
            toast.error('Error creating Perdin');
            console.error('Form submission error:', error);
            setIsSubmitting(false);
        }
    };

    // Map kota list to Select options
    const kotaOptions = useMemo(() => {
        return kotas.map((kota) => ({ value: kota.id, label: kota.nama }));
    }, [kotas]);

    const filteredPerdins = useMemo(() => {
        return perdins.filter(
            (perdin) =>
                perdin.kota_asal?.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                perdin.kota_tujuan?.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                perdin.maksud_tujuan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                perdin.status.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }, [perdins, searchTerm]);

    const totalItems = filteredPerdins.length;
    const totalPages = pageSize === 'All' ? 1 : Math.ceil(totalItems / pageSize);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, pageSize]);

    const currentItems = useMemo(() => {
        if (pageSize === 'All') return filteredPerdins;

        const startIndex = (currentPage - 1) * pageSize;
        return filteredPerdins.slice(startIndex, startIndex + pageSize);
    }, [filteredPerdins, currentPage, pageSize]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (value: string) => {
        setPageSize(value === 'All' ? 'All' : (Number(value) as PageSize));
        setCurrentPage(1);
    };

    const formatDate = (dateStr: string) =>
        new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(new Date(dateStr));

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300">Approved</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300">Rejected</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <AppLayout>
            <Head title="Perdin Ku | Akhdani" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading title="Perjalanan Dinas Ku" description="Manage your business trips" />
                    <Button onClick={openAddModal} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add New Perdin
                    </Button>
                </div>

                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                    <div className="relative w-full max-w-sm flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                        <Input
                            placeholder="Search trips by city, purpose, or status..."
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

                <div className="overflow-hidden rounded-lg border bg-card">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-12 font-semibold">#</TableHead>
                                    <TableHead className="font-semibold">Kota</TableHead>
                                    <TableHead className="font-semibold">Tanggal</TableHead>
                                    <TableHead className="w-24 text-center font-semibold">Durasi</TableHead>
                                    <TableHead className="w-[30%] font-semibold">Maksud Tujuan</TableHead>
                                    <TableHead className="w-28 text-center font-semibold">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentItems.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                            {searchTerm
                                                ? `No trips found matching "${searchTerm}"`
                                                : 'No business trips found. Click "Add New Perdin" to create one.'}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    currentItems.map((perdin, idx) => {
                                        const globalIndex = pageSize === 'All' ? idx + 1 : (currentPage - 1) * Number(pageSize) + idx + 1;
                                        return (
                                            <TableRow key={perdin.id} className="hover:bg-muted/50">
                                                <TableCell className="font-medium">{globalIndex}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium">{perdin.kota_asal?.nama || '-'}</span>
                                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium">{perdin.kota_tujuan?.nama || '-'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <span>
                                                                        {formatDate(perdin.tanggal_berangkat)} - {formatDate(perdin.tanggal_pulang)}
                                                                    </span>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>
                                                                        Berangkat: {formatDate(perdin.tanggal_berangkat)}
                                                                        <br />
                                                                        Kembali: {formatDate(perdin.tanggal_pulang)}
                                                                    </p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline" className="font-mono">
                                                        {perdin.durasi_hari} hari
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="pr-4 break-words whitespace-normal">{perdin.maksud_tujuan}</TableCell>
                                                <TableCell className="text-center">{getStatusBadge(perdin.status)}</TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {filteredPerdins.length > 0 && pageSize !== 'All' && (
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

                {/* Add Perdin Dialog */}
                <Dialog open={modalOpen} onOpenChange={(open) => !isSubmitting && setModalOpen(open)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add New Perdin</DialogTitle>
                            <DialogDescription>Enter your business trip details.</DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Cities Selection */}
                            <div className="space-y-2">
                                <Label>Kota *</Label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1">
                                        <Select
                                            value={form.asal_kota_id ? String(form.asal_kota_id) : ''}
                                            onValueChange={(value) => setForm((prev) => ({ ...prev, asal_kota_id: Number(value) }))}
                                            required
                                            disabled={isSubmitting}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Source" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {kotaOptions.map((kota) => (
                                                    <SelectItem key={`source-${kota.value}`} value={String(kota.value)}>
                                                        {kota.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <ArrowRight className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                    <div className="flex-1">
                                        <Select
                                            value={form.tujuan_kota_id ? String(form.tujuan_kota_id) : ''}
                                            onValueChange={(value) => setForm((prev) => ({ ...prev, tujuan_kota_id: Number(value) }))}
                                            required
                                            disabled={isSubmitting}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Destination" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {kotaOptions.map((kota) => (
                                                    <SelectItem key={`dest-${kota.value}`} value={String(kota.value)}>
                                                        {kota.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                {formErrors.cities && <p className="mt-1 text-sm text-destructive">{formErrors.cities}</p>}
                            </div>

                            {/* Dates Selection */}
                            <div className="space-y-2">
                                <Label>Tanggal *</Label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1">
                                        <Input
                                            id="tanggal_berangkat"
                                            name="tanggal_berangkat"
                                            type="date"
                                            value={form.tanggal_berangkat}
                                            onChange={(e) => setForm((prev) => ({ ...prev, tanggal_berangkat: e.target.value }))}
                                            required
                                            placeholder="From"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <ArrowRight className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                    <div className="flex-1">
                                        <Input
                                            id="tanggal_kembali"
                                            name="tanggal_kembali"
                                            type="date"
                                            value={form.tanggal_kembali}
                                            onChange={(e) => setForm((prev) => ({ ...prev, tanggal_kembali: e.target.value }))}
                                            required
                                            placeholder="To"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                                {formErrors.dates && <p className="mt-1 text-sm text-destructive">{formErrors.dates}</p>}
                            </div>

                            {/* Maksud / Tujuan */}
                            <div className="space-y-2">
                                <Label htmlFor="maksud_tujuan">Maksud / Tujuan *</Label>
                                <Input
                                    id="maksud_tujuan"
                                    name="maksud_tujuan"
                                    type="text"
                                    value={form.maksud_tujuan}
                                    onChange={(e) => setForm((prev) => ({ ...prev, maksud_tujuan: e.target.value }))}
                                    required
                                    placeholder="Enter purpose of your business trip"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <DialogFooter className="gap-2 pt-2">
                                <Button type="button" variant="outline" onClick={() => setModalOpen(false)} disabled={isSubmitting}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Perdin'
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
