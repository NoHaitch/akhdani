<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $this->authorizeAdmin();

        $users = User::all();

        return Inertia::render('admin/users', [
            'users' => $users,
        ]);
    }

    public function updateRole(Request $request, User $user): RedirectResponse
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'role' => 'required|in:PEGAWAI,ADMIN,DIVISI-SDM',
        ]);

        $user->role = $validated['role'];
        $user->save();

        return back()->with('status', 'User role updated.');
    }

    protected function authorizeAdmin(): void
    {
        if (auth()->user()?->role !== 'ADMIN') {
            abort(403, 'Unauthorized');
        }
    }
}
