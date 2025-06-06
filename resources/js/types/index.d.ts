import type { LucideIcon } from "lucide-react"
import type { Config } from "ziggy-js"

export interface Auth {
    user: User
}

export interface BreadcrumbItem {
    title: string
    href: string
}

export interface NavGroup {
    title: string
    items: NavItem[]
}

export interface NavItem {
    title: string
    href: string
    icon?: LucideIcon | null
    isActive?: boolean
}

export interface SharedData {
    name: string
    quote: { message: string; author: string }
    auth: Auth
    ziggy: Config & { location: string }
    sidebarOpen: boolean
    [key: string]: unknown
}

export interface User {
    id: number
    name: string
    username: string
    email: string
    role?: string
    avatar?: string
    email_verified_at: string | null
    created_at: string
    updated_at: string
    [key: string]: unknown
}

export interface Kota {
    id: number;
    nama: string;
    latitude: number;
    longitude: number;
    provinsi: string;
    pulau: string;
    luar_negeri: boolean;
}

export interface Perdin {
    durasi: ReactNode
    pegawai_nama: ReactNode
    asal_kota_nama: ReactNode
    tujuan_kota_nama: ReactNode
    id: number;
    user_id: number;
    maksud_tujuan: string;
    tanggal_berangkat: string;
    tanggal_pulang: string;
    kota_asal_id: number;
    kota_tujuan_id: number;
    durasi_hari: number;
    uang_saku_per_hari: string;
    total_uang_saku: string;
    status: string;
    disetujui_oleh: number | null;
    tanggal_disetujui: string | null;
    created_at: string;
    updated_at: string;
    kota_asal?: Kota;
    kota_tujuan?: Kota;
}