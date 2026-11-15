<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Actualite extends Model
{
    // Nom de la table (optionnel si le nom de la table est 'actualites')
    protected $table = 'actualites';

    // Champs remplissables pour les opérations de création/mise à jour
    protected $fillable = [
        'titre',
        'contenu',
        'date_publication',
        'auteur',
        'image',
    ];

    // Activer les timestamps (created_at, updated_at)
    public $timestamps = true;

    // Optionnel : Définir les types de données pour certains champs
    protected $casts = [
        'date_publication' => 'datetime',
    ];
}