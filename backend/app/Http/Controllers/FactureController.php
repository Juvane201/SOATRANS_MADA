<?php

namespace App\Http\Controllers;

use App\Models\Facture;
use App\Models\Reservation;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FactureController extends Controller
{
    /**
     * Liste toutes les factures
     */
    public function index()
    {
        try {
            $factures = Facture::with(['client', 'voiture'])->get();
            return response()->json([
                'success' => true,
                'data' => $factures
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur index factures: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des factures'
            ], 500);
        }
    }

    /**
     * Créer une nouvelle facture
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'reservation_id' => 'required|exists:reservations,id',
            'montant_total' => 'required|numeric|min:0',
        ]);

        try {
            $reservation = Reservation::with('voiture')->findOrFail($validated['reservation_id']);

            // 1. On cherche si un client existe déjà avec ce CIN
            $client = Client::where('cin', $reservation->cin_client)->first();

            // 2. S'il n'existe pas, on le crée avec TOUTES les infos demandées
            if (!$client) {
                $client = Client::create([
                    'nom' => $reservation->nom_client,
                    'prenom' => $reservation->prenom_client,
                    'cin' => $reservation->cin_client ?? 'CIN-' . rand(100000, 999999),
                    'contact' => $reservation->tel_client,
                    'voiture_id' => $reservation->voiture_id,
                    'reservation_id' => $reservation->id,
                    'place' => $reservation->place_reserver,
                    'nombre' => $reservation->nombre_places_reservees
                ]);
            } else {
                // Optionnel : Si le client existe déjà, on met à jour ses infos
                $client->update([
                    'contact' => $reservation->tel_client,
                    'voiture_id' => $reservation->voiture_id,
                    'reservation_id' => $reservation->id,
                    'place' => $reservation->place_reserver,
                    'nombre' => $reservation->nombre_places_reservees
                ]);
            }

            // 3. On crée la facture
            $facture = Facture::create([
                'client_id' => $client->id,
                'voiture_id' => $reservation->voiture_id,
                'nombre_places_reservees' => $reservation->nombre_places_reservees,
                'frais' => $validated['montant_total'],
                'destination' => $reservation->destination,
                'heure_depart' => $reservation->voiture ? $reservation->voiture->heure_depart : '00:00',
            ]);

            // 4. Numéro de facture virtuel pour le PDF
            $facture->numero_facture = 'FACT-' . date('Ymd') . '-' . str_pad($facture->id, 4, '0', STR_PAD_LEFT);

            return response()->json([
                'success' => true,
                'data' => $facture,
                'message' => 'Facture créée avec succès'
            ], 201);

        } catch (\Exception $e) {
            Log::error('Erreur création facture: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la facture',
                'error' => $e->getMessage()
            ], 500);
        }
    }

        public function destroy(Facture $facture)
    {
        try {
            $facture->delete();
            return response()->json(['success' => true, 'message' => 'Facture supprimée']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur'], 500);
        }
    }
    public function show($id)
    {
        try {
            $facture = Facture::with(['client', 'voiture'])->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $facture
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Facture non trouvée'
            ], 404);
        }
    }
}