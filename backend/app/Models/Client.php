<?php

namespace App\Models;

use App\Models\Facture;
use App\Models\Reservation;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = [
        'nom', 
        'prenom', 
        'cin', 
        'contact',
        'voiture_id',
        'reservation_id',
        'place',
        'nombre'
    ];

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function factures()
    {
        return $this->hasMany(Facture::class);
    }
}