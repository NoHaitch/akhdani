<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Kota;
use App\Models\PerjalananDinas;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(10)->create();

        // Create Admin user from .env
        $admin = User::updateOrCreate(
            ['email' => env('ADMIN_EMAIL')],
            [
                'name' => env('ADMIN_NAME', 'Admin User'),
                'username' => env('ADMIN_USERNAME', 'admin'),
                'email' => env('ADMIN_EMAIL'),
                'password' => Hash::make(env('ADMIN_PASSWORD', 'password')),
                'role' => 'ADMIN',
            ]
        );


        // Seed kota data
        Kota::truncate();

        Kota::insert([
            [
                'nama' => 'Jakarta',
                'latitude' => -6.2088,
                'longitude' => 106.8456,
                'provinsi' => 'DKI Jakarta',
                'pulau' => 'Jawa',
                'luar_negeri' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Bandung',
                'latitude' => -6.9175,
                'longitude' => 107.6191,
                'provinsi' => 'Jawa Barat',
                'pulau' => 'Jawa',
                'luar_negeri' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Surabaya',
                'latitude' => -7.2575,
                'longitude' => 112.7521,
                'provinsi' => 'Jawa Timur',
                'pulau' => 'Jawa',
                'luar_negeri' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Singapore',
                'latitude' => 1.3521,
                'longitude' => 103.8198,
                'provinsi' => 'Singapore',
                'pulau' => 'Singapore',
                'luar_negeri' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Kuala Lumpur',
                'latitude' => 3.139,
                'longitude' => 101.6869,
                'provinsi' => 'Wilayah Persekutuan Kuala Lumpur',
                'pulau' => 'Peninsular Malaysia',
                'luar_negeri' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Bangkok',
                'latitude' => 13.7563,
                'longitude' => 100.5018,
                'provinsi' => 'Bangkok',
                'pulau' => 'Mainland Asia',
                'luar_negeri' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Tokyo',
                'latitude' => 35.6762,
                'longitude' => 139.6503,
                'provinsi' => 'Tokyo',
                'pulau' => 'Honshu',
                'luar_negeri' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Sydney',
                'latitude' => -33.8688,
                'longitude' => 151.2093,
                'provinsi' => 'New South Wales',
                'pulau' => 'Australia',
                'luar_negeri' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'New York',
                'latitude' => 40.7128,
                'longitude' => -74.006,
                'provinsi' => 'New York',
                'pulau' => 'North America',
                'luar_negeri' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'London',
                'latitude' => 51.5072,
                'longitude' => -0.1276,
                'provinsi' => 'England',
                'pulau' => 'Great Britain',
                'luar_negeri' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // You can keep your original Indonesian cities too:
            [
                'nama' => 'Semarang',
                'latitude' => -6.9667,
                'longitude' => 110.4167,
                'provinsi' => 'Jawa Tengah',
                'pulau' => 'Jawa',
                'luar_negeri' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Medan',
                'latitude' => 3.5952,
                'longitude' => 98.6722,
                'provinsi' => 'Sumatera Utara',
                'pulau' => 'Sumatera',
                'luar_negeri' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Denpasar',
                'latitude' => -8.6705,
                'longitude' => 115.2126,
                'provinsi' => 'Bali',
                'pulau' => 'Bali',
                'luar_negeri' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Makassar',
                'latitude' => -5.1477,
                'longitude' => 119.4327,
                'provinsi' => 'Sulawesi Selatan',
                'pulau' => 'Sulawesi',
                'luar_negeri' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Jayapura',
                'latitude' => -2.5337,
                'longitude' => 140.7181,
                'provinsi' => 'Papua',
                'pulau' => 'Papua',
                'luar_negeri' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Fetch kota IDs for asal and tujuan
        $jakarta = Kota::where('nama', 'Jakarta')->first();
        $bandung = Kota::where('nama', 'Bandung')->first();
        $surabaya = Kota::where('nama', 'Surabaya')->first();
        $singapore = Kota::where('nama', 'Singapore')->first();
        $denpasar = Kota::where('nama', 'Denpasar')->first();
        $london = Kota::where('nama', 'London')->first();
        $sydney = Kota::where('nama', 'Sydney')->first();
        $makassar = Kota::where('nama', 'Makassar')->first();

        PerjalananDinas::truncate();

        PerjalananDinas::create([
            'user_id' => $admin->id,
            'maksud_tujuan' => 'Meeting with Bandung office',
            'tanggal_berangkat' => '2025-07-01',
            'tanggal_pulang' => '2025-07-03',
            'kota_asal_id' => $jakarta->id,
            'kota_tujuan_id' => $bandung->id,
            'durasi_hari' => 3,
            'uang_saku_per_hari' => 200000,
            'total_uang_saku' => 600000,
            'status' => 'approved',
            'disetujui_oleh' => $admin->id,
            'tanggal_disetujui' => now(),
        ]);

        PerjalananDinas::create([
            'user_id' => $admin->id,
            'maksud_tujuan' => 'Site inspection in Surabaya',
            'tanggal_berangkat' => '2025-08-15',
            'tanggal_pulang' => '2025-08-16',
            'kota_asal_id' => $jakarta->id,
            'kota_tujuan_id' => $surabaya->id,
            'durasi_hari' => 2,
            'uang_saku_per_hari' => 250000,
            'total_uang_saku' => 500000,
            'status' => 'pending',
            'disetujui_oleh' => null,
            'tanggal_disetujui' => null,
        ]);

        PerjalananDinas::create([
            'user_id' => $admin->id,
            'maksud_tujuan' => 'Tech conference in Singapore',
            'tanggal_berangkat' => '2025-09-10',
            'tanggal_pulang' => '2025-09-14',
            'kota_asal_id' => $jakarta->id,
            'kota_tujuan_id' => $singapore->id,
            'durasi_hari' => 5,
            'uang_saku_per_hari' => 50 * 17000,
            'total_uang_saku' => 5 * (50 * 17000),
            'status' => 'pending',
            'disetujui_oleh' => null,
            'tanggal_disetujui' => null,
        ]);

        PerjalananDinas::create([
            'user_id' => $admin->id,
            'maksud_tujuan' => 'Team building in Bali',
            'tanggal_berangkat' => '2025-10-05',
            'tanggal_pulang' => '2025-10-07',
            'kota_asal_id' => $jakarta->id,
            'kota_tujuan_id' => $denpasar->id,
            'durasi_hari' => 3,
            'uang_saku_per_hari' => 300000,
            'total_uang_saku' => 900000,
            'status' => 'approved',
            'disetujui_oleh' => $admin->id,
            'tanggal_disetujui' => now(),
        ]);

        PerjalananDinas::create([
            'user_id' => $admin->id,
            'maksud_tujuan' => 'Business trip to London',
            'tanggal_berangkat' => '2025-11-01',
            'tanggal_pulang' => '2025-11-08',
            'kota_asal_id' => $jakarta->id,
            'kota_tujuan_id' => $london->id,
            'durasi_hari' => 8,
            'uang_saku_per_hari' => 50 * 15000,
            'total_uang_saku' => 8 * (50 * 15000),
            'status' => 'rejected',
            'disetujui_oleh' => $admin->id,
            'tanggal_disetujui' => now(),
        ]);

        PerjalananDinas::create([
            'user_id' => $admin->id,
            'maksud_tujuan' => 'Training in Sydney',
            'tanggal_berangkat' => '2025-12-15',
            'tanggal_pulang' => '2025-12-22',
            'kota_asal_id' => $jakarta->id,
            'kota_tujuan_id' => $sydney->id,
            'durasi_hari' => 8,
            'uang_saku_per_hari' => 50 * 15000,
            'total_uang_saku' => 8 * (50 * 15000),
            'status' => 'pending',
            'disetujui_oleh' => null,
            'tanggal_disetujui' => null,
        ]);

        PerjalananDinas::create([
            'user_id' => $admin->id,
            'maksud_tujuan' => 'Regional meeting in Makassar',
            'tanggal_berangkat' => '2025-09-20',
            'tanggal_pulang' => '2025-09-22',
            'kota_asal_id' => $jakarta->id,
            'kota_tujuan_id' => $makassar->id,
            'durasi_hari' => 3,
            'uang_saku_per_hari' => 300000,
            'total_uang_saku' => 900000,
            'status' => 'pending',
            'disetujui_oleh' => null,
            'tanggal_disetujui' => null,
        ]);
    }
}
