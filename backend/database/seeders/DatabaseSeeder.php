<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Client;
use App\Models\Facture;
use App\Models\Voiture;
use App\Models\Reservation;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Admin - HASHER le mot de passe
        Admin::create([
            'nom' => 'juvane',
            'code' => Hash::make('juvane'), // IMPORTANT: Hasher le mot de passe
        ]);

        // // Clients
        // $client1 = Client::create([
        //     'nom' => 'Dupont',
        //     'prenom' => 'Jean',
        //     'cin' => '123456789012',
        //     // 'email' => 'jean.dupont@example.com',
        //     // 'telephone' => '0321234567',
        //     // 'adresse' => '123 Rue de Paris, Antananarivo',
        //     // 'sexe' => 'M',
        // ]);

        // $client2 = Client::create([
        //     'nom' => 'Rakoto',
        //     'prenom' => 'Marie',
        //     'cin' => '987654321098',
        //     // 'email' => 'marie.rakoto@example.com',
        //     // 'telephone' => '0349876543',
        //     // 'adresse' => '456 Avenue de l\'Indépendance, Mahajanga',
        //     // 'sexe' => 'F',
        // ]);

        // // Voitures avec les NOUVELLES colonnes
        // $voiture1 = Voiture::create([
        //     'numero_voiture' => 'V001',
        //     'nombre_places' => 25,
        //     'image' => 'voitures/mercedes-bus.jpg',
        //     'ville_depart' => 'Antananarivo', // NOUVELLE colonne
        //     'destination' => 'Mahajanga',
        //     'frais' => 50000.00,
        //     'date_voyage' => now()->addDays(3)->format('Y-m-d'), // NOUVELLE colonne
        //     'heure_depart' => '07:30:00',
        // ]);

        // $voiture2 = Voiture::create([
        //     'numero_voiture' => 'V002',
        //     'nombre_places' => 30,
        //     'image' => 'voitures/volvo-bus.jpg',
        //     'ville_depart' => 'Antananarivo', // NOUVELLE colonne
        //     'destination' => 'Toamasina',
        //     'frais' => 45000.00,
        //     'date_voyage' => now()->addDays(2)->format('Y-m-d'), // NOUVELLE colonne
        //     'heure_depart' => '08:00:00',
        // ]);

        // $voiture3 = Voiture::create([
        //     'numero_voiture' => 'V003',
        //     'nombre_places' => 20,
        //     'image' => 'voitures/scania-bus.jpg',
        //     'ville_depart' => 'Mahajanga', // NOUVELLE colonne
        //     'destination' => 'Antananarivo',
        //     'frais' => 48000.00,
        //     'date_voyage' => now()->addDays(4)->format('Y-m-d'), // NOUVELLE colonne
        //     'heure_depart' => '06:00:00',
        // ]);

        // // Réservations avec les NOUVELLES colonnes
        // $reservation1 = Reservation::create([
        //     'reference' => 'RES-' . Str::upper(Str::random(8)), // NOUVELLE colonne
        //     'voiture_id' => $voiture1->id,
        //     'nombre_places_reservees' => 2,
        //     'frais' => 100000.00, // 2 x 50000
        //     'ville_depart' => $voiture1->ville_depart,
        //     'destination' => $voiture1->destination,
        //     'date_voyage' => $voiture1->date_voyage, // NOUVELLE colonne
        //     'place_reserver' => '1,2', // NOUVELLE colonne (places spécifiques)
        //     'nom_client' => $client1->nom,
        //     'prenom_client' => $client1->prenom,
        //     'tel_client' => $client1->telephone,
        //     'sexe_client' => $client1->sexe,
        //     'email_client' => $client1->email,
        //     'adresse_client' => $client1->adresse,
        // ]);

        // $reservation2 = Reservation::create([
        //     'reference' => 'RES-' . Str::upper(Str::random(8)), // NOUVELLE colonne
        //     'voiture_id' => $voiture2->id,
        //     'nombre_places_reservees' => 1,
        //     'frais' => 45000.00, // 1 x 45000
        //     'ville_depart' => $voiture2->ville_depart,
        //     'destination' => $voiture2->destination,
        //     'date_voyage' => $voiture2->date_voyage, // NOUVELLE colonne
        //     'place_reserver' => '5', // NOUVELLE colonne
        //     'nom_client' => $client2->nom,
        //     'prenom_client' => $client2->prenom,
        //     'tel_client' => $client2->telephone,
        //     'sexe_client' => $client2->sexe,
        //     'email_client' => $client2->email,
        //     'adresse_client' => $client2->adresse,
        // ]);

        // // Factures
        // $facture1 = Facture::create([
        //     'client_id' => $client1->id,
        //     'voiture_id' => $voiture1->id,
        //     'reservation_id' => $reservation1->id,
        //     'reference' => 'FACT-' . Str::upper(Str::random(8)),
        //     'nombre_places_reservees' => 2,
        //     'frais' => 100000.00,
        //     'ville_depart' => $voiture1->ville_depart,
        //     'destination' => $voiture1->destination,
        //     'date_voyage' => $voiture1->date_voyage,
        //     'statut' => 'payée',
        //     'methode_paiement' => 'espèces',
        // ]);

        // $facture2 = Facture::create([
        //     'client_id' => $client2->id,
        //     'voiture_id' => $voiture2->id,
        //     'reservation_id' => $reservation2->id,
        //     'reference' => 'FACT-' . Str::upper(Str::random(8)),
        //     'nombre_places_reservees' => 1,
        //     'frais' => 45000.00,
        //     'ville_depart' => $voiture2->ville_depart,
        //     'destination' => $voiture2->destination,
        //     'date_voyage' => $voiture2->date_voyage,
        //     'statut' => 'en_attente',
        //     'methode_paiement' => 'mobile_money',
        // ]);

        // Message de confirmation
        $this->command->info('Admin bien créées');
    
        // $this->command->info('Réservations créées: ' . $reservation1->reference . ', ' . $reservation2->reference);
    }
}