<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MasterKotaController;
use App\Http\Controllers\PerjalananDinasController;
use Illuminate\Support\Facades\Auth;

// Redirect root to login
Route::get('/', function () {
    if (!Auth::check()) {
        return redirect('/login');
    }
    return redirect('/perdinku');
});

Route::get('/home', function () {
    return redirect()->route('perdinku');
})->name('home');


Route::middleware(['auth'])->group(function () {
    Route::get('/kotas', [MasterKotaController::class, 'apiIndex']);

    Route::get('/perdinku', [PerjalananDinasController::class, 'index'])->name('perdinku');
    Route::post('/perdinku', [PerjalananDinasController::class, 'store'])->name('perdinku.store');

    Route::middleware('sdm')->patch('/perdinku/{perdin}/approve', [PerjalananDinasController::class, 'approve'])->name('perdinku.approve');

    Route::middleware(['admin'])->prefix('admin')->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('admin.users');
        Route::patch('/users/{user}/role', [UserController::class, 'updateRole'])->name('admin.users.updateRole');
    });

    Route::middleware(['sdm'])->prefix('sdm')->group(function () {
        Route::get('/master-kota', [MasterKotaController::class, 'index'])->name('master.kota');
        Route::get('/master-kota/create', [MasterKotaController::class, 'create'])->name('master.kota.create');
        Route::post('/master-kota', [MasterKotaController::class, 'store'])->name('master.kota.store');
        Route::get('/master-kota/{kota}/edit', [MasterKotaController::class, 'edit'])->name('master.kota.edit');
        Route::put('/master-kota/{kota}', [MasterKotaController::class, 'update'])->name('master.kota.update');
        Route::delete('/master-kota/{kota}', [MasterKotaController::class, 'destroy'])->name('master.kota.destroy');

        Route::get('/pengajuan-perdin', [PerjalananDinasController::class, 'pengajuan'])->name('sdm.pengajuan_perdin');

    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
