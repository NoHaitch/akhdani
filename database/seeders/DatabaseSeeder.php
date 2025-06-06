<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Kota;
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
        User::updateOrCreate(
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
    }
}
