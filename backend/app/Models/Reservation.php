<?php

namespace App\Models;

use App\Models\Client;
use App\Models\Voiture;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
        protected $fillable = [
        'voiture_id',
        'nombre_places_reservees',
        'place_reserver',
        'frais',
        'ville_depart',
        'destination',
        'date_voyage',
        'nom_client',
        'prenom_client',
        'tel_client',
        'sexe_client',
        'cin_client',     
        'adresse_client'   
    ];

    protected $casts = [
        'date_voyage' => 'date', 
        'created_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s',
    ];

    // Suppression de la relation avec Client
    // public function client()
    // {
    //     return $this->belongsTo(Client::class);
    // }

    public function voiture()
    {
        return $this->belongsTo(Voiture::class);
    }

    // Accessor pour le nom complet du client
    public function getNomCompletAttribute()
    {
        return $this->nom_client . ' ' . $this->prenom_client;
    }

    // Accessor pour le téléphone
    public function getTelephoneAttribute()
    {
        return $this->tel_client;
    }

    // Accessor pour le sexe
    public function getSexeAttribute()
    {
        return match($this->sexe_client) {
            'M' => 'Masculin',
            'F' => 'Féminin',
            'Autre' => 'Autre',
            default => 'Non spécifié'
        };
    }

    // Accessor pour les places réservées (formaté)
    public function getPlacesReserveesFormateAttribute()
    {
        if ($this->place_reserver) {
            return $this->place_reserver;
        }
        return $this->nombre_places_reservees . ' place(s)';
    }
}