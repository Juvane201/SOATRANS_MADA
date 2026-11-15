<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'admin';

    protected $fillable = ['nom', 'code'];

    protected $hidden = ['code', 'remember_token'];

    // Vérifier que la colonne code existe dans la table
    // Si non, créer la migration
}