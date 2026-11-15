<?php

namespace App\Http\Controllers;

use App\Models\Voiture;
use App\Models\Reservation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class VoitureController extends Controller
{
    public function index(Request $request)
{
    // Récupérer les paramètres de la requête
    $limit = $request->input('limit', 20);
    $dateVoyage = $request->input('date_voyage');
    $villeDepart = $request->input('ville_depart');
    $destination = $request->input('destination');
    
    $query = Voiture::select([
        'id', 'numero_voiture', 'nombre_places', 'image',
        'ville_depart', 'destination', 'frais', 'date_voyage', 'heure_depart'
    ]);
    
    // Ajouter les filtres si présents
    if ($dateVoyage) {
        $query->where('date_voyage', $dateVoyage);
    }
    
    if ($villeDepart) {
        $query->where('ville_depart', 'like', '%' . $villeDepart . '%');
    }
    
    if ($destination) {
        $query->where('destination', 'like', '%' . $destination . '%');
    }
    
    // Calcul des places réservées avec une sous-requête
    $voitures = $query->orderBy('date_voyage', 'desc')
        ->paginate($limit);

    // Transformez les données
    $voitures->getCollection()->transform(function ($voiture) {
        $placesReservees = Reservation::where('voiture_id', $voiture->id)
            ->where('date_voyage', $voiture->date_voyage)
            ->sum('nombre_places_reservees');
        
        $placesDisponibles = max(0, $voiture->nombre_places - $placesReservees);
        
        return [
            'id' => $voiture->id,
            'numero_voiture' => $voiture->numero_voiture,
            'nombre_places' => $voiture->nombre_places,
            'image_url' => $voiture->image ? asset("storage/{$voiture->image}") : null,
            'ville_depart' => $voiture->ville_depart,
            'destination' => $voiture->destination,
            'frais' => $voiture->frais,
            'date_voyage' => $voiture->date_voyage,
            'date_voyage_formate' => $voiture->date_voyage ? \Carbon\Carbon::parse($voiture->date_voyage)->format('d/m/Y') : null,
            'heure_depart' => $voiture->heure_depart,
            'places_disponibles' => $placesDisponibles,
            'disponible' => $placesDisponibles > 0,
            'reservations_count' => $placesReservees
        ];
    });

    return response()->json([
        'success' => true,
        'data' => $voitures->items(),
        'meta' => [
            'current_page' => $voitures->currentPage(),
            'last_page' => $voitures->lastPage(),
            'per_page' => $voitures->perPage(),
            'total' => $voitures->total(),
        ]
    ]);
}
    public function store(Request $request)
    {
        $validated = $request->validate([
            'numero_voiture' => 'required|unique:voitures',
            'nombre_places' => 'required|integer|min:1',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // Réduit à 5MB
            'ville_depart' => 'required|string|max:255',
            'destination' => 'required|string|max:255',
            'frais' => 'required|numeric|min:0',
            'date_voyage' => 'required|date',
            'heure_depart' => 'required|date_format:H:i',
        ]);

        try {
            $imagePath = $request->file('image')->store('voitures', 'public');
            
            $voiture = Voiture::create([
                'numero_voiture' => $validated['numero_voiture'],
                'nombre_places' => $validated['nombre_places'],
                'image' => $imagePath,
                'ville_depart' => $validated['ville_depart'],
                'destination' => $validated['destination'],
                'frais' => $validated['frais'],
                'date_voyage' => $validated['date_voyage'],
                'heure_depart' => $validated['heure_depart'],
            ]);

            // Invalider le cache
            Cache::forget('voitures_all');

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $voiture->id,
                    'numero_voiture' => $voiture->numero_voiture,
                    'nombre_places' => $voiture->nombre_places,
                    'image_url' => asset("storage/{$imagePath}"),
                    'ville_depart' => $voiture->ville_depart,
                    'destination' => $voiture->destination,
                    'frais' => $voiture->frais,
                    'date_voyage' => $voiture->date_voyage,
                    'date_voyage_formate' => $voiture->date_voyage ? \Carbon\Carbon::parse($voiture->date_voyage)->format('d/m/Y') : null,
                    'heure_depart' => $voiture->heure_depart,
                    'places_disponibles' => $voiture->nombre_places,
                    'disponible' => true
                ],
                'message' => 'Voiture créée avec succès'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la voiture',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function searchAvailable(Request $request)
{
        \Log::info('=== APPEL DE searchAvailable ===');
    try {
        $request->validate([
            'ville_depart' => 'nullable|string',
            'destination' => 'nullable|string',
            'date_voyage' => 'nullable|date',
        ]);

        $query = Voiture::query();

        if ($request->filled('ville_depart')) {
            $query->where('ville_depart', 'LIKE', '%' . $request->ville_depart . '%');
        }

        if ($request->filled('destination')) {
            $query->where('destination', 'LIKE', '%' . $request->destination . '%');
        }

        if ($request->filled('date_voyage')) {
            $query->where('date_voyage', $request->date_voyage);
        }

        $voitures = $query->get();

        // FORCEZ le retour d'un tableau vide si aucun résultat
        if ($voitures->isEmpty()) {
            return response()->json([
                'success' => true,
                'data' => [],
                'message' => 'Aucun résultat trouvé',
                'total' => 0
            ]);
        }

        // Transformation garantie en tableau
        $data = [];
        foreach ($voitures as $voiture) {
            $placesReservees = Reservation::where('voiture_id', $voiture->id)
                ->where('date_voyage', $voiture->date_voyage)
                ->sum('nombre_places_reservees');
            
            $data[] = [
                'id' => $voiture->id,
                'numero_voiture' => $voiture->numero_voiture,
                'nombre_places' => $voiture->nombre_places,
                'image_url' => $voiture->image ? asset("storage/{$voiture->image}") : null,
                'ville_depart' => $voiture->ville_depart,
                'destination' => $voiture->destination,
                'frais' => $voiture->frais,
                'date_voyage' => $voiture->date_voyage,
                'date_voyage_formate' => $voiture->date_voyage ? \Carbon\Carbon::parse($voiture->date_voyage)->format('d/m/Y') : null,
                'heure_depart' => $voiture->heure_depart,
                'places_disponibles' => max(0, $voiture->nombre_places - $placesReservees),
                'disponible' => ($voiture->nombre_places - $placesReservees) > 0,
                'reservations_count' => $placesReservees
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $data, // Garanti d'être un tableau
            'total' => count($data)
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la recherche',
            'error' => env('APP_DEBUG') ? $e->getMessage() : null
        ], 500);
    }
}

   
    public function storePublic(Request $request)
    {
        return $this->store($request);
    }

    public function show(Voiture $voiture)
    {
        $voiture->loadCount(['reservations' => function($query) use ($voiture) {
            $query->where('date_voyage', $voiture->date_voyage);
        }]);
        
        $placesReservees = Reservation::where('voiture_id', $voiture->id)
            ->where('date_voyage', $voiture->date_voyage)
            ->sum('nombre_places_reservees');
        
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $voiture->id,
                'numero_voiture' => $voiture->numero_voiture,
                'nombre_places' => $voiture->nombre_places,
                'image_url' => $voiture->image ? asset("storage/{$voiture->image}") : null,
                'ville_depart' => $voiture->ville_depart,
                'destination' => $voiture->destination,
                'frais' => $voiture->frais,
                'date_voyage' => $voiture->date_voyage,
                'date_voyage_formate' => $voiture->date_voyage ? \Carbon\Carbon::parse($voiture->date_voyage)->format('d/m/Y') : null,
                'heure_depart' => $voiture->heure_depart,
                'places_disponibles' => max(0, $voiture->nombre_places - $placesReservees),
                'disponible' => ($voiture->nombre_places - $placesReservees) > 0,
                'reservations_count' => $voiture->reservations_count,
                'created_at' => $voiture->created_at,
                'updated_at' => $voiture->updated_at
            ]
        ], 200);
    }

    public function update(Request $request, Voiture $voiture)
    {
        $validated = $request->validate([
            'numero_voiture' => 'required|unique:voitures,numero_voiture,' . $voiture->id,
            'nombre_places' => 'required|integer|min:1',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'ville_depart' => 'required|string|max:255',
            'destination' => 'required|string|max:255',
            'frais' => 'required|numeric|min:0',
            'date_voyage' => 'required|date',
            'heure_depart' => 'required|date_format:H:i',
        ]);

        try {
            $data = [
                'numero_voiture' => $validated['numero_voiture'],
                'nombre_places' => $validated['nombre_places'],
                'ville_depart' => $validated['ville_depart'],
                'destination' => $validated['destination'],
                'frais' => $validated['frais'],
                'date_voyage' => $validated['date_voyage'],
                'heure_depart' => $validated['heure_depart'],
            ];

            if ($request->hasFile('image')) {
                // Supprimer l'ancienne image si elle existe
                if ($voiture->image && Storage::disk('public')->exists($voiture->image)) {
                    Storage::disk('public')->delete($voiture->image);
                }
                $imagePath = $request->file('image')->store('voitures', 'public');
                $data['image'] = $imagePath;
            }

            $voiture->update($data);
            
            // Invalider le cache
            Cache::forget('voitures_all');

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $voiture->id,
                    'numero_voiture' => $voiture->numero_voiture,
                    'nombre_places' => $voiture->nombre_places,
                    'image_url' => $voiture->image ? asset("storage/{$voiture->image}") : null,
                    'ville_depart' => $voiture->ville_depart,
                    'destination' => $voiture->destination,
                    'frais' => $voiture->frais,
                    'date_voyage' => $voiture->date_voyage,
                    'date_voyage_formate' => $voiture->date_voyage ? \Carbon\Carbon::parse($voiture->date_voyage)->format('d/m/Y') : null,
                    'heure_depart' => $voiture->heure_depart,
                ],
                'message' => 'Voiture mise à jour avec succès'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Voiture $voiture)
    {
        try {
            // Supprimer l'image si elle existe
            if ($voiture->image && Storage::disk('public')->exists($voiture->image)) {
                Storage::disk('public')->delete($voiture->image);
            }
            
            $voiture->delete();
            
            // Invalider le cache
            Cache::forget('voitures_all');
            
            return response()->json([
                'success' => true,
                'message' => 'Voiture supprimée avec succès'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function searchByDate(Request $request)
    {
        $request->validate([
            'date_voyage' => 'required|date',
            'ville_depart' => 'nullable|string',
            'destination' => 'nullable|string',
        ]);

        $query = Voiture::where('date_voyage', $request->date_voyage)
            ->withCount(['reservations' => function($query) use ($request) {
                $query->where('date_voyage', $request->date_voyage);
            }]);

        if ($request->ville_depart) {
            $query->where('ville_depart', 'like', '%' . $request->ville_depart . '%');
        }

        if ($request->destination) {
            $query->where('destination', 'like', '%' . $request->destination . '%');
        }

        $voitures = $query->paginate(20);

        $voitures->getCollection()->transform(function ($voiture) {
            $placesDisponibles = max(0, $voiture->nombre_places - ($voiture->reservations_count ?? 0));
            
            return [
                'id' => $voiture->id,
                'numero_voiture' => $voiture->numero_voiture,
                'nombre_places' => $voiture->nombre_places,
                'image_url' => $voiture->image ? asset("storage/{$voiture->image}") : null,
                'ville_depart' => $voiture->ville_depart,
                'destination' => $voiture->destination,
                'frais' => $voiture->frais,
                'date_voyage' => $voiture->date_voyage,
                'date_voyage_formate' => $voiture->date_voyage ? \Carbon\Carbon::parse($voiture->date_voyage)->format('d/m/Y') : null,
                'heure_depart' => $voiture->heure_depart,
                'places_disponibles' => $placesDisponibles,
                'disponible' => $placesDisponibles > 0
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $voitures->items(),
            'meta' => [
                'current_page' => $voitures->currentPage(),
                'total' => $voitures->total(),
                'per_page' => $voitures->perPage()
            ]
        ]);
    }

    public function indexPublic(Request $request)
    {
        $query = Voiture::select([
            'id', 'numero_voiture', 'nombre_places', 'image',
            'ville_depart', 'destination', 'frais', 'date_voyage', 'heure_depart'
        ])
        // MODIFICATION : Supprimer le filtre where('date_voyage', '>=', ...) pour afficher TOUTES les voitures
        ->withCount(['reservations' => function($query) {
            $query->select(\DB::raw('SUM(nombre_places_reservees)'));
        }]);
        
        if ($request->has('date_voyage')) {
            $query->where('date_voyage', $request->date_voyage);
        }
        
        if ($request->has('ville_depart')) {
            $query->where('ville_depart', 'like', '%' . $request->ville_depart . '%');
        }
        
        if ($request->has('destination')) {
            $query->where('destination', 'like', '%' . $request->destination . '%');
        }
        
        $voitures = $query->orderBy('date_voyage')->paginate(20);

        $voitures->getCollection()->transform(function ($voiture) {
            $placesDisponibles = max(0, $voiture->nombre_places - ($voiture->reservations_count ?? 0));
            
            return [
                'id' => $voiture->id,
                'numero_voiture' => $voiture->numero_voiture,
                'nombre_places' => $voiture->nombre_places,
                'image_url' => $voiture->image ? asset("storage/{$voiture->image}") : null,
                'ville_depart' => $voiture->ville_depart,
                'destination' => $voiture->destination,
                'frais' => $voiture->frais,
                'date_voyage' => $voiture->date_voyage,
                'date_voyage_formate' => $voiture->date_voyage ? \Carbon\Carbon::parse($voiture->date_voyage)->format('d/m/Y') : null,
                'heure_depart' => $voiture->heure_depart,
                'places_disponibles' => $placesDisponibles,
                'disponible' => $placesDisponibles > 0
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $voitures->items(),
            'meta' => [
                'current_page' => $voitures->currentPage(),
                'total' => $voitures->total(),
                'per_page' => $voitures->perPage()
            ]
        ]);
    }

    public function showPublic(Voiture $voiture)
    {
            \Log::info("Recherche de la voiture ID: " . ($voiture->id ?? 'AUCUN ID TROUVÉ'));
        $reservationsCount = Reservation::where('voiture_id', $voiture->id)
            ->where('date_voyage', $voiture->date_voyage)
            ->sum('nombre_places_reservees');
        
        $placesReservees = Reservation::where('voiture_id', $voiture->id)
            ->where('date_voyage', $voiture->date_voyage)
            ->whereNotNull('place_reserver')
            ->pluck('place_reserver')
            ->flatMap(function($places) {
                return array_map('trim', explode(',', $places));
            })
            ->filter()
            ->values()
            ->toArray();
        
        $placesLibres = array_diff(range(1, $voiture->nombre_places), $placesReservees);
        $placesDisponibles = max(0, $voiture->nombre_places - $reservationsCount);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $voiture->id,
                'numero_voiture' => $voiture->numero_voiture,
                'nombre_places' => $voiture->nombre_places,
                'image_url' => $voiture->image ? asset("storage/{$voiture->image}") : null,
                'ville_depart' => $voiture->ville_depart,
                'destination' => $voiture->destination,
                'frais' => $voiture->frais,
                'date_voyage' => $voiture->date_voyage,
                'date_voyage_formate' => $voiture->date_voyage ? \Carbon\Carbon::parse($voiture->date_voyage)->format('d/m/Y') : null,
                'heure_depart' => $voiture->heure_depart,
                'places_disponibles' => $placesDisponibles,
                'disponible' => $placesDisponibles > 0,
                'places_reservees' => $placesReservees,
                'places_libres' => array_values($placesLibres),
                'reservations_count' => $reservationsCount
            ]
        ]);
    }

    public function getDestinations()
    {
        $destinations = Cache::remember('popular_destinations', 3600, function () {
            return Voiture::select('destination', 'ville_depart')
                ->selectRaw('COUNT(*) as count')
                ->groupBy('destination', 'ville_depart')
                ->orderBy('count', 'desc')
                ->limit(10)
                ->get();
        });

        return response()->json([
            'success' => true,
            'data' => $destinations
        ]);
    }

    public function getAvailableDates(Request $request)
    {
        $request->validate([
            'ville_depart' => 'required|string',
            'destination' => 'required|string',
        ]);

        $dates = Voiture::where('ville_depart', 'like', '%' . $request->ville_depart . '%')
            ->where('destination', 'like', '%' . $request->destination . '%')
            // MODIFICATION : Supprimer le filtre where('date_voyage', '>=', ...) pour afficher TOUTES les dates
            ->select('date_voyage')
            ->selectRaw('COUNT(*) as total_voitures')
            ->groupBy('date_voyage')
            ->orderBy('date_voyage')
            ->get()
            ->map(function($item) {
                return [
                    'date' => $item->date_voyage,
                    'date_formatee' => \Carbon\Carbon::parse($item->date_voyage)->format('d/m/Y'),
                    'total_voitures' => $item->total_voitures,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $dates
        ]);
    }

    public function getAvailablePlaces(Voiture $voiture)
    {
        $placesReservees = Reservation::where('voiture_id', $voiture->id)
            ->where('date_voyage', $voiture->date_voyage)
            ->whereNotNull('place_reserver')
            ->pluck('place_reserver')
            ->flatMap(function($places) {
                return array_map('trim', explode(',', $places));
            })
            ->filter()
            ->values()
            ->toArray();
        
        $placesLibres = array_values(array_diff(range(1, $voiture->nombre_places), $placesReservees));

        return response()->json([
            'success' => true,
            'data' => [
                'total_places' => $voiture->nombre_places,
                'places_reservees' => $placesReservees,
                'places_libres' => $placesLibres,
                'places_disponibles_count' => count($placesLibres)
            ]
        ]);
    }

    public function placesStatistics()
    {
        $statistics = Cache::remember('places_statistics', 300, function () {
            $totalVoitures = Voiture::count();
            $totalPlaces = Voiture::sum('nombre_places');
            $placesReservees = Reservation::sum('nombre_places_reservees');
            
            return [
                'total_voitures' => $totalVoitures,
                'total_places' => $totalPlaces,
                'places_reservees' => $placesReservees,
                'places_disponibles' => max(0, $totalPlaces - $placesReservees),
                'voitures_par_date' => Voiture::select('date_voyage')
                    ->selectRaw('COUNT(*) as count')
                    ->groupBy('date_voyage')
                    ->orderBy('date_voyage', 'desc')
                    ->limit(30)
                    ->get()
                    ->map(function($item) {
                        return [
                            'date' => $item->date_voyage,
                            'count' => $item->count
                        ];
                    })
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $statistics
        ]);
    }

    public function indexAdmin()
    {
        // Version admin avec plus de données
        return $this->index();
    }
}