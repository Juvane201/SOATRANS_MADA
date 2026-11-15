<?php

namespace App\Models;

use App\Models\Client;
use App\Models\Voiture;
use Illuminate\Database\Eloquent\Model;

class Facture extends Model
{
  protected $fillable = [
        'client_id',
        'voiture_id',
        'nombre_places_reservees',
        'frais',
        'destination',
        'heure_depart'
    ];
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function voiture()
    {
        return $this->belongsTo(Voiture::class);
    }

}
