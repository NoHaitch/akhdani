<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kota extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'latitude',
        'longitude',
        'provinsi',
        'pulau',
        'luar_negeri',
    ];

    protected $casts = [
        'luar_negeri' => 'boolean',
        'latitude' => 'float',
        'longitude' => 'float',
    ];
}