'use client';

import { Head, router } from '@inertiajs/react';
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, Loader2, MapPin, Search, User } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import type { Perdin } from '@/types';

interface PengajuanPerdinProps {
    perdins: Perdin[];
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 'All'] as const;
type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

export default function PengajuanPerdin({ perdins }: PengajuanPerdinProps) {
    const [perdinsList, setPerdinsList] = useState<Perdin[]>(perdins);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState<PageSize>(10);
    const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});

    const filteredPerdins = useMemo(() => {
        return perdinsList.filter(
            (perdin) =>
                perdin.pegawai_nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                perdin.asal_kota_nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                perdin.tujuan_kota_nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                perdin.maksud_tujuan?.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }, [perdinsList, searchTerm]);

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

    const formatDate = (dateStr: string) => {
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(new Date(dateStr));
    };

    const formatCurrency = (amount: string | number) => {
        const numAmount = typeof amount === 'string' ? Number.parseFloat(amount) : amount;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(numAmount);
    };

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

    const handleChangeStatus = async (perdinId: number, newStatus: 'approved' | 'rejected') => {
        setLoadingStates((prev) => ({ ...prev, [perdinId]: true }));

        try {
            await router.patch(
                route('perdinku.approve', { perdin: perdinId }),
                { status: newStatus },
                {
                    onSuccess: () => {
                        toast.success(`Perdin ${newStatus === 'approved' ? 'approved' : 'rejected'}`);
                        setPerdinsList((prev) => prev.map((perdin) => (perdin.id === perdinId ? { ...perdin, status: newStatus } : perdin)));
                    },
                    onError: (errors) => {
                        toast.error(`Error updating Perdin status`);
                        console.error('Change status error:', errors);
                    },
                    onFinish: () => {
                        setLoadingStates((prev) => ({ ...prev, [perdinId]: false }));
                    },
                },
            );
        } catch (error) {
            toast.error(`Error updating Perdin status`);
            console.error('Change status error:', error);
            setLoadingStates((prev) => ({ ...prev, [perdinId]: false }));
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
            <Head title="Pengajuan Perdin | SDM" />

            <div className="space-y-6 p-6">
                <Heading title="Pengajuan Perdin" description="Approve or reject business trips" />

                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                    <div className="relative w-full max-w-sm flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                        <Input
                            placeholder="Search by employee, city, or purpose..."
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
                                    <TableHead className="font-semibold">Nama Pegawai</TableHead>
                                    <TableHead className="font-semibold">Kota</TableHead>
                                    <TableHead className="font-semibold">Tanggal & Durasi</TableHead>
                                    <TableHead className="w-[25%] font-semibold">Maksud</TableHead>
                                    <TableHead className="w-28 text-center font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold">Total Uang Saku</TableHead>
                                    <TableHead className="w-40 text-center font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentItems.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                                            {searchTerm ? `No perdins found matching "${searchTerm}"` : 'No perdins found.'}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    currentItems.map((perdin, idx) => {
                                        const globalIndex = pageSize === 'All' ? idx + 1 : (currentPage - 1) * Number(pageSize) + idx + 1;
                                        const isLoading = loadingStates[perdin.id] || false;

                                        return (
                                            <TableRow key={perdin.id} className="hover:bg-muted/50">
                                                <TableCell className="font-medium">{globalIndex}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium">{perdin.pegawai_nama}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium">{perdin.asal_kota_nama}</span>
                                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium">{perdin.tujuan_kota_nama}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div className="space-y-1">
                                                                        <div className="text-sm">
                                                                            {formatDate(perdin.tanggal_berangkat)} -{' '}
                                                                            {formatDate(perdin.tanggal_pulang)}
                                                                        </div>
                                                                        <Badge variant="outline" className="font-mono text-xs">
                                                                            {perdin.durasi} hari
                                                                        </Badge>
                                                                    </div>
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
                                                <TableCell className="pr-4 break-words whitespace-normal">{perdin.maksud_tujuan}</TableCell>
                                                <TableCell className="text-center">{getStatusBadge(perdin.status)}</TableCell>
                                                <TableCell className="font-mono text-sm">{formatCurrency(perdin.total_uang_saku)}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-center gap-2">
                                                        {perdin.status === 'pending' ? (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleChangeStatus(perdin.id, 'approved')}
                                                                    disabled={isLoading}
                                                                    className="bg-green-600 hover:bg-green-700"
                                                                >
                                                                    {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Approve'}
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    onClick={() => handleChangeStatus(perdin.id, 'rejected')}
                                                                    disabled={isLoading}
                                                                >
                                                                    {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Reject'}
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <span className="text-sm text-muted-foreground">No actions available</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Pagination */}
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
            </div>
        </AppLayout>
    );
}
