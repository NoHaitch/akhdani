<?php

namespace App\Http\Controllers;

use App\Models\PerjalananDinas;
use App\Models\Kota;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class PerjalananDinasController extends Controller
{
    /**
     * Show all Perdin owned by the authenticated user.
     */
    public function index()
    {
        $userId = Auth::id();

        $perdins = PerjalananDinas::where('user_id', $userId)
            ->with(['kotaAsal', 'kotaTujuan'])
            ->orderByDesc('created_at')
            ->get();

        return inertia('Perdinku', [
            'perdins' => $perdins,
        ]);
    }

    /**
     * Store new Perdin with all logic.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'maksud_tujuan' => 'required|string',
            'tanggal_berangkat' => 'required|date',
            'tanggal_pulang' => 'required|date|after_or_equal:tanggal_berangkat',
            'kota_asal_id' => ['required', 'exists:kotas,id'],
            'kota_tujuan_id' => ['required', 'exists:kotas,id'],
        ]);

        $startDate = Carbon::parse($data['tanggal_berangkat']);
        $endDate = Carbon::parse($data['tanggal_pulang']);
        $durasi_hari = $endDate->diffInDays($startDate) + 1;

        $kotaAsal = Kota::findOrFail($data['kota_asal_id']);
        $kotaTujuan = Kota::findOrFail($data['kota_tujuan_id']);

        $distance = $this->calculateDistance(
            $kotaAsal->latitude,
            $kotaAsal->longitude,
            $kotaTujuan->latitude,
            $kotaTujuan->longitude
        );

        $uang_saku_per_hari = 0;

        if ($kotaTujuan->luar_negeri) {
            $usdToIdr = 15000;
            $uang_saku_per_hari = 50 * $usdToIdr;
        } else {
            if ($distance > 60) {
                if ($kotaAsal->provinsi === $kotaTujuan->provinsi) {
                    $uang_saku_per_hari = 200000;
                } elseif ($kotaAsal->pulau === $kotaTujuan->pulau) {
                    $uang_saku_per_hari = 250000;
                } else {
                    $uang_saku_per_hari = 300000;
                }
            }
        }

        $total_uang_saku = $uang_saku_per_hari * $durasi_hari;

        $perdin = PerjalananDinas::create([
            'user_id' => Auth::id(),
            'maksud_tujuan' => $data['maksud_tujuan'],
            'tanggal_berangkat' => $data['tanggal_berangkat'],
            'tanggal_pulang' => $data['tanggal_pulang'],
            'kota_asal_id' => $data['kota_asal_id'],
            'kota_tujuan_id' => $data['kota_tujuan_id'],
            'durasi_hari' => $durasi_hari,
            'uang_saku_per_hari' => $uang_saku_per_hari,
            'total_uang_saku' => $total_uang_saku,
            'status' => 'pending',
        ]);

        return redirect()->route('perdinku')->with('success', 'Perjalanan dinas berhasil diajukan.');
    }

    /**
     * (For SDM) Approve or reject perdin request.
     */
    public function approve(Request $request, PerjalananDinas $perdin)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);

        $this->authorize('sdm');

        $perdin->status = $request->status;
        $perdin->disetujui_oleh = Auth::id();
        $perdin->tanggal_disetujui = now();
        $perdin->save();

        return redirect()->back()->with('success', 'Status perjalanan dinas berhasil diperbarui.');
    }

    /**
     * Calculate distance between two lat-lon points using Haversine formula.
     * Returns distance in kilometers.
     */
    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371; // km

        $latFrom = deg2rad($lat1);
        $lonFrom = deg2rad($lon1);
        $latTo = deg2rad($lat2);
        $lonTo = deg2rad($lon2);

        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        $angle = 2 * asin(sqrt(
            pow(sin($latDelta / 2), 2) +
            cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)
        ));

        return $angle * $earthRadius;
    }
}
