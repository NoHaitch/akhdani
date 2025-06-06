<?php

namespace App\Http\Controllers;

use App\Models\Kota;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MasterKotaController extends Controller
{
    /**
     * Display a listing of the kota.
     */
    public function index(): Response
    {
        $kotas = Kota::all();
        return Inertia::render('sdm/master-kota', [
            'kotas' => $kotas,
        ]);
    }

    /**
     * Show the form for creating a new kota.
     */
    public function create(): Response
    {
        return Inertia::render('sdm/master-kota-create');
    }

    /**
     * Store a newly created kota in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'provinsi' => 'required|string|max:255',
            'pulau' => 'required|string|max:255',
            'luar_negeri' => 'required|boolean',
        ]);

        Kota::create($validated);

        return redirect()->route('master.kota')->with('success', 'Kota created successfully.');
    }

    /**
     * Show the form for editing the specified kota.
     */
    public function edit(Kota $kota): Response
    {
        return Inertia::render('sdm/master-kota-edit', [
            'kota' => $kota,
        ]);
    }

    /**
     * Update the specified kota in storage.
     */
    public function update(Request $request, Kota $kota): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'provinsi' => 'required|string|max:255',
            'pulau' => 'required|string|max:255',
            'luar_negeri' => 'required|boolean',
        ]);

        $kota->update($validated);

        return redirect()->route('master.kota')->with('success', 'Kota updated successfully.');
    }

    /**
     * Remove the specified kota from storage.
     */
    public function destroy(Kota $kota): RedirectResponse
    {
        $kota->delete();

        return redirect()->route('master.kota')->with('success', 'Kota deleted successfully.');
    }
}
