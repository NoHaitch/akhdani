<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PerjalananDinas extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'maksud_tujuan',
        'tanggal_berangkat',
        'tanggal_pulang',
        'kota_asal_id',
        'kota_tujuan_id',
        'durasi_hari',
        'uang_saku_per_hari',
        'total_uang_saku',
        'status',
        'disetujui_oleh',
        'tanggal_disetujui',
    ];

    public function kotaAsal()
    {
        return $this->belongsTo(Kota::class, 'kota_asal_id');
    }

    public function kotaTujuan()
    {
        return $this->belongsTo(Kota::class, 'kota_tujuan_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'disetujui_oleh');
    }
}
