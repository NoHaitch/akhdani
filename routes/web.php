<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;

// Redirect root to login
Route::get('/', function () {
    if (!Auth::check()) {
        return redirect('/login');
    }
    return redirect('/perdinku');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/perdinku', function () {
        return Inertia::render('perdinku');
    })->name('perdinku');

    Route::middleware(['admin'])->prefix('admin')->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('admin.users');
        Route::patch('/users/{user}/role', [UserController::class, 'updateRole'])->name('admin.users.updateRole');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
