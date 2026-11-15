<?php

namespace App\Http\Controllers;

use App\Models\Voiture;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class ReservationController extends Controller
{
    /**
     * Afficher la liste des réservations (admin)
     */
public function index(Request $request)
{
    try {
        // On ne charge que la voiture, pas le client (qui n'existe pas dans cette table)
        $reservations = Reservation::with('voiture')->orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'success' => true,
            'data' => $reservations
        ]);
    } catch (\Exception $e) {
        Log::error('Erreur index reservations: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Erreur',
            'error' => $e->getMessage()
        ], 500);
    }
}

    /**
     * Créer une nouvelle réservation (admin)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'voiture_id' => 'required|exists:voitures,id',
            'nombre_places_reservees' => 'required|integer|min:1',
            'frais' => 'required|numeric|min:0',
            'ville_depart' => 'required|string|max:255',
            'destination' => 'required|string|max:255',
            'date_voyage' => 'required|date',
            'place_reserver' => 'nullable|string|max:255',
            'nom_client' => 'required|string|max:255',
            'prenom_client' => 'required|string|max:255',
            'tel_client' => 'required|string|max:20',
            'sexe_client' => 'required|in:M,F,Autre',
            'cin_client' => 'required|string|max:50',
            'adresse_client' => 'nullable|string'
        ]);

        try {
            $reservation = Reservation::create($validated);

            return response()->json([
                'success' => true,
                'data' => $reservation,
                'message' => 'Réservation créée avec succès'
            ], 201);
        } catch (\Exception $e) {
            Log::error('Erreur store: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création'
            ], 500);
        }
    }

    /**
     * Afficher une réservation spécifique
     */
    public function show($id)
    {
        try {
            $reservation = Reservation::with('voiture')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $reservation
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Réservation non trouvée'
            ], 404);
        }
    }

    /**
     * Mettre à jour une réservation (admin)
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nombre_places_reservees' => 'sometimes|integer|min:1',
            'frais' => 'sometimes|numeric|min:0',
            'place_reserver' => 'nullable|string|max:255',
            'nom_client' => 'sometimes|string|max:255',
            'prenom_client' => 'sometimes|string|max:255',
            'tel_client' => 'sometimes|string|max:20',
            'sexe_client' => 'sometimes|in:M,F,Autre',
            'cin_client' => 'sometimes|string|max:50',
            'adresse_client' => 'nullable|string'
        ]);

        try {
            $reservation = Reservation::findOrFail($id);
            $reservation->update($validated);

            return response()->json([
                'success' => true,
                'data' => $reservation,
                'message' => 'Réservation mise à jour avec succès'
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur update: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour'
            ], 500);
        }
    }

    /**
     * Supprimer une réservation (admin)
     */
    public function destroy($id)
    {
        try {
            $reservation = Reservation::findOrFail($id);
            $reservation->delete();

            return response()->json([
                'success' => true,
                'message' => 'Réservation supprimée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression'
            ], 500);
        }
    }

    /**
     * Créer une réservation publique (sans authentification)
     */
    public function storePublic(Request $request)
    {
        $validated = $request->validate([
            'voiture_id' => 'required|exists:voitures,id',
            'nombre_places_reservees' => 'required|integer|min:1',
            'place_reserver' => 'nullable|string|max:255',
            'nom_client' => 'required|string|max:255',
            'prenom_client' => 'required|string|max:255',
            'tel_client' => 'required|string|max:20',
            'sexe_client' => 'required|in:M,F,Autre',
            'date_voyage' => 'required|date',
            'cin_client' => 'required|string|max:50',
            'adresse_client' => 'nullable|string'
        ]);

        try {
            $voiture = Voiture::findOrFail($validated['voiture_id']);
            
            $dateDemandee = Carbon::parse($validated['date_voyage'])->format('Y-m-d');
            $placesDisponibles = $this->calculateAvailablePlaces($voiture->id, $dateDemandee);

            if ($validated['nombre_places_reservees'] > $placesDisponibles) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nombre de places insuffisant. Il reste ' . $placesDisponibles . ' place(s) disponible(s).'
                ], 400);
            }

            if (!empty($validated['place_reserver'])) {
                $placesDemandees = array_map('trim', explode(',', $validated['place_reserver']));
                
                if (count($placesDemandees) != $validated['nombre_places_reservees']) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Le nombre de places spécifiées ne correspond pas au nombre de places réservées.'
                    ], 400);
                }
                
                $placesReservees = $this->getReservedPlacesForVoiture($voiture->id, $dateDemandee);
                $placesDejaReservees = array_intersect($placesDemandees, $placesReservees);
                
                if (!empty($placesDejaReservees)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Les places suivantes sont déjà réservées: ' . implode(', ', $placesDejaReservees)
                    ], 400);
                }
            }

            $reservation = Reservation::create([
                'voiture_id' => $validated['voiture_id'],
                'nombre_places_reservees' => $validated['nombre_places_reservees'],
                'place_reserver' => $validated['place_reserver'] ?? null,
                'frais' => $voiture->frais * $validated['nombre_places_reservees'],
                'ville_depart' => $voiture->ville_depart,
                'destination' => $voiture->destination,
                'date_voyage' => $dateDemandee,
                'nom_client' => $validated['nom_client'],
                'prenom_client' => $validated['prenom_client'],
                'tel_client' => $validated['tel_client'],
                'sexe_client' => $validated['sexe_client'],
                'cin_client' => $validated['cin_client'],
                'adresse_client' => $validated['adresse_client'] ?? null
            ]);

            Cache::forget("voiture_{$voiture->id}_places_{$dateDemandee}");

            return response()->json([
                'success' => true,
                'data' => $reservation,
                'message' => 'Réservation créée avec succès',
                'reference' => 'RES-' . str_pad($reservation->id, 6, '0', STR_PAD_LEFT)
            ], 201);

        } catch (\Exception $e) {
            Log::error('Erreur storePublic: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la réservation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Vérifier la disponibilité des places (public)
     */
    public function checkAvailabilityPublic(Request $request)
    {
        $validated = $request->validate([
            'voiture_id' => 'required|exists:voitures,id',
            'date_voyage' => 'required|date',
            'nombre_places' => 'required|integer|min:1',
            'place_reserver' => 'nullable|string|max:255'
        ]);

        try {
            $voiture = Voiture::findOrFail($validated['voiture_id']);
            
            $dateDemandee = Carbon::parse($validated['date_voyage'])->format('Y-m-d');
            $dateVoiture = Carbon::parse($voiture->date_voyage)->format('Y-m-d');

            if ($dateDemandee !== $dateVoiture) {
                return response()->json([
                    'success' => false,
                    'available' => false,
                    'message' => 'Aucun voyage disponible pour cette date'
                ]);
            }
            
            $placesDisponibles = $this->calculateAvailablePlaces($voiture->id, $dateDemandee);
            $available = $validated['nombre_places'] <= $placesDisponibles;
            
            $response = [
                'success' => true,
                'available' => $available,
                'places_disponibles' => $placesDisponibles,
                'voiture' => [
                    'id' => $voiture->id,
                    'numero_voiture' => $voiture->numero_voiture,
                    'ville_depart' => $voiture->ville_depart,
                    'destination' => $voiture->destination,
                    'date_voyage' => $dateVoiture,
                    'heure_depart' => $voiture->heure_depart,
                    'frais' => $voiture->frais
                ]
            ];
            
            if (!empty($validated['place_reserver'])) {
                $placesDemandees = array_filter(
                    array_map('trim', explode(',', $validated['place_reserver'])),
                    'is_numeric'
                );

                if (!empty($placesDemandees)) {
                    $placesReservees = $this->getReservedPlacesForVoiture($voiture->id, $dateDemandee);
                    $placesDisponiblesList = array_diff(range(1, $voiture->nombre_places), $placesReservees);
                    
                    $allPlacesAvailable = true;
                    $placesNonDisponibles = [];
                    
                    foreach ($placesDemandees as $place) {
                        if (!in_array($place, $placesDisponiblesList)) {
                            $allPlacesAvailable = false;
                            $placesNonDisponibles[] = $place;
                        }
                    }
                    
                    $response['places_specifiques'] = [
                        'all_available' => $allPlacesAvailable,
                        'places_non_disponibles' => $placesNonDisponibles,
                        'places_disponibles_list' => array_values($placesDisponiblesList)
                    ];
                    
                    if (!$allPlacesAvailable) {
                        $response['available'] = false;
                        $response['message'] = 'Certaines places spécifiques ne sont pas disponibles';
                    }
                }
            }
            
            return response()->json($response);

        } catch (\Exception $e) {
            Log::error('Erreur checkAvailability: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'available' => false,
                'message' => 'Erreur lors de la vérification : ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Vérifier le statut d'une réservation par référence
     */
    public function checkStatus($reference)
    {
        try {
            $id = (int) str_replace('RES-', '', $reference);
            $reservation = Reservation::with('voiture')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $reservation->id,
                    'reference' => 'RES-' . str_pad($reservation->id, 6, '0', STR_PAD_LEFT),
                    'nom_complet' => $reservation->nom_client . ' ' . $reservation->prenom_client,
                    'telephone' => $reservation->tel_client,
                    'sexe' => $reservation->sexe_client,
                    'frais' => $reservation->frais,
                    'nombre_places_reservees' => $reservation->nombre_places_reservees,
                    'ville_depart' => $reservation->ville_depart,
                    'destination' => $reservation->destination,
                    'date_voyage' => $reservation->date_voyage,
                    'voiture' => $reservation->voiture ? [
                        'id' => $reservation->voiture->id,
                        'numero_voiture' => $reservation->voiture->numero_voiture,
                        'heure_depart' => $reservation->voiture->heure_depart
                    ] : null,
                    'created_at' => $reservation->created_at->format('d/m/Y H:i')
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Réservation non trouvée'
            ], 404);
        }
    }

    public function reservationsByDate(Request $request)
    {
        $request->validate([
            'date_voyage' => 'required|date'
        ]);

        $reservations = Reservation::with('voiture')
            ->where('date_voyage', $request->date_voyage)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $reservations
        ]);
    }

    public function confirm($id)
    {
        return response()->json([
            'success' => true,
            'message' => 'Fonctionnalité à implémenter'
        ]);
    }

    public function cancel($id)
    {
        return response()->json([
            'success' => true,
            'message' => 'Fonctionnalité à implémenter'
        ]);
    }

    public function getReservedPlaces(Voiture $voiture, Request $request)
    {
        $request->validate([
            'date_voyage' => 'required|date'
        ]);
        
        $placesReservees = $this->getReservedPlacesForVoiture($voiture->id, $request->date_voyage);
        
        return response()->json([
            'success' => true,
            'data' => [
                'places_reservees' => $placesReservees,
                'count' => count($placesReservees)
            ]
        ]);
    }

    private function getReservedPlacesForVoiture($voitureId, $dateVoyage)
    {
        try {
            return Reservation::where('voiture_id', $voitureId)
                ->where('date_voyage', $dateVoyage)
                ->whereNotNull('place_reserver')
                ->pluck('place_reserver')
                ->flatMap(function($places) {
                    return array_map('trim', explode(',', $places));
                })
                ->filter()
                ->values()
                ->toArray();
        } catch (\Exception $e) {
            Log::error('Erreur getReservedPlaces: ' . $e->getMessage());
            return [];
        }
    }

    private function calculateAvailablePlaces($voitureId, $dateVoyage)
    {
        try {
            $voiture = Voiture::find($voitureId);
            if (!$voiture) return 0;
            
            $placesReservees = Reservation::where('voiture_id', $voitureId)
                ->where('date_voyage', $dateVoyage)
                ->sum('nombre_places_reservees');
            
            return max(0, $voiture->nombre_places - $placesReservees);
        } catch (\Exception $e) {
            Log::error('Erreur calculateAvailablePlaces: ' . $e->getMessage());
            return 0;
        }
    }
}