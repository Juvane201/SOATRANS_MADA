<?php

namespace Database\Seeders;

use App\Models\Actualite;
use Illuminate\Database\Seeder;

class ActualiteSeeder extends Seeder
{
    public function run()
    {
        Actualite::create([
            'titre' => 'Nouvelle ligne de bus',
            'contenu' => 'Nous lançons une nouvelle ligne de bus vers Paris à partir du 1er août.',
            'date_publication' => now(),
            'auteur' => 'Admin',
            'image' => 'actualites/test-image.jpg', // Image de test (ajoutez une image manuellement dans storage/app/public/actualites)
        ]);
        Actualite::create([
            'titre' => 'Mise à jour des horaires',
            'contenu' => 'Les horaires des bus ont été mis à jour pour la saison estivale.',
            'date_publication' => now(),
            'auteur' => 'Admin',
        ]);
    }
}