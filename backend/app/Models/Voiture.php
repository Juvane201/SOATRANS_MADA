<?php

namespace App\Models;

use App\Models\Facture;
use App\Models\Reservation;
use Illuminate\Database\Eloquent\Model;

class Voiture extends Model
{
    protected $fillable = [
        'numero_voiture',
        'nombre_places',
        'image',
        'ville_depart',
        'destination',
        'frais',
        'date_voyage',      // Nouvelle colonne
        'heure_depart'
    ];

    protected $casts = [
        'date_voyage' => 'date', // Cast pour la date
    ];

    protected $appends = [
        'image_url',
        'date_voyage_formate',
        // On enlève 'places_disponibles' et 'disponible' des appends !
    ];

    // ======================
    // Relations
    // ======================
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function factures()
    {
        return $this->hasMany(Facture::class);
    }

    // ======================
    // Accessors (sûrs)
    // ======================

    // URL complète de l'image
    public function getImageUrlAttribute()
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }

    // Date formatée jj/mm/aaaa
    public function getDateVoyageFormateAttribute()
    {
        return $this->date_voyage?->format('d/m/Y');
    }

    // ======================
    // Méthodes utilitaires (à appeler quand tu en as besoin)
    // ======================

    /**
     * Calcule le nombre de places encore disponibles
     */
    public function placesDisponibles()
    {
        // Utilise withSum dans le contrôleur pour éviter les requêtes N+1
        // mais si tu l'appelles ici ponctuellement, c'est OK
        $reservees = $this->reservations()->sum('nombre_places_reservees');
        return $this->nombre_places - $reservees;
    }

    /**
     * Indique si la voiture a encore au moins une place libre
     */
    public function estDisponible()
    {
        return $this->placesDisponibles() > 0;
    }

    // ======================
    // Méthode bonus : à utiliser dans tes contrôleurs pour charger efficacement
    // ======================
    public function scopeDisponibles($query)
    {
        return $query->withSum('reservations', 'nombre_places_reservees')
                     ->havingRaw('nombre_places - reservations_sum_nombre_places_reservees > 0');
    }
}