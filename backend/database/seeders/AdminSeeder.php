<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder   extends Seeder
{
    public function run(): void
    {
        Admin::create([
            'nom' => 'juvane',
            'code' => Hash::make('juvane'), // Hash le mot de passe
        ]);
    }
}