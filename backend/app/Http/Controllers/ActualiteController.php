<?php

namespace App\Http\Controllers;

use App\Models\Actualite;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage; // Ajouter pour vérifier la table

class ActualiteController extends Controller
{
    public function index()
    {
        try {
            // Vérifier si la table existe
            if (!Schema::hasTable('actualites')) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'Table des actualités non créée'
                ], 200);
            }
            
            // Utiliser la pagination au lieu de all()
            $actualites = Actualite::select([
                'id', 'titre', 'contenu', 'image', 
                'date_publication', 'auteur', 'created_at'
            ])
            ->orderBy('date_publication', 'desc')
            ->paginate(10); // Limité à 10 par page
            
            // Transformer les données
            $actualites->getCollection()->transform(function ($actualite) {
                return [
                    'id' => $actualite->id,
                    'titre' => $actualite->titre,
                    'contenu' => substr($actualite->contenu, 0, 200) . (strlen($actualite->contenu) > 200 ? '...' : ''),
                    'contenu_complet' => $actualite->contenu,
                    'image_url' => $actualite->image ? asset("storage/{$actualite->image}") : null,
                    'date_publication' => $actualite->date_publication ? $actualite->date_publication->format('d/m/Y') : null,
                    'auteur' => $actualite->auteur ?? 'Administrateur',
                    'created_at' => $actualite->created_at->format('d/m/Y H:i'),
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $actualites->items(),
                'meta' => [
                    'current_page' => $actualites->currentPage(),
                    'last_page' => $actualites->lastPage(),
                    'per_page' => $actualites->perPage(),
                    'total' => $actualites->total(),
                ]
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des actualités',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Méthode publique pour le site web (sans authentification)
    public function indexPublic()
    {
        try {
            // Vérifier si la table existe
            if (!Schema::hasTable('actualites')) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'Aucune actualité disponible'
                ]);
            }
            
            // Version simplifiée pour le public
            $actualites = Actualite::select([
                'id', 'titre', 'contenu', 'image', 
                'date_publication', 'auteur'
            ])
            ->where('date_publication', '<=', now())
            ->orderBy('date_publication', 'desc')
            ->limit(5) // Seulement les 5 dernières
            ->get();
            
            $data = $actualites->map(function ($actualite) {
                return [
                    'id' => $actualite->id,
                    'titre' => $actualite->titre,
                    'contenu' => substr($actualite->contenu, 0, 150) . (strlen($actualite->contenu) > 150 ? '...' : ''),
                    'image_url' => $actualite->image ? asset("storage/{$actualite->image}") : null,
                    'date_publication' => $actualite->date_publication ? $actualite->date_publication->format('d/m/Y') : null,
                    'auteur' => $actualite->auteur ?? 'SOATRANS MNK',
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $data,
                'count' => $actualites->count()
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'contenu' => 'required|string',
            'date_publication' => 'required|date',
            'auteur' => 'nullable|string|max:255', // Rendre nullable
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:20480',
        ]);

        try {
            // Valeur par défaut pour l'auteur
            if (empty($validated['auteur'])) {
                $validated['auteur'] = 'Administrateur';
            }

            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('actualites', 'public');
                $validated['image'] = $imagePath;
            }

            $actualite = Actualite::create($validated);

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $actualite->id,
                    'titre' => $actualite->titre,
                    'contenu' => $actualite->contenu,
                    'image_url' => $actualite->image ? asset("storage/{$actualite->image}") : null,
                    'date_publication' => $actualite->date_publication->format('Y-m-d'),
                    'auteur' => $actualite->auteur,
                ],
                'message' => 'Actualité créée avec succès'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de l\'actualité',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $actualite = Actualite::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $actualite->id,
                    'titre' => $actualite->titre,
                    'contenu' => $actualite->contenu,
                    'image_url' => $actualite->image ? asset("storage/{$actualite->image}") : null,
                    'date_publication' => $actualite->date_publication ? $actualite->date_publication->format('d/m/Y') : null,
                    'auteur' => $actualite->auteur,
                    'created_at' => $actualite->created_at->format('d/m/Y H:i'),
                ]
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Actualité non trouvée'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $actualite = Actualite::findOrFail($id);
            
            $validated = $request->validate([
                'titre' => 'string|max:255',
                'contenu' => 'string',
                'date_publication' => 'date',
                'auteur' => 'nullable|string|max:255',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:20480',
            ]);

            if ($request->hasFile('image')) {
                // Supprimer l'ancienne image si elle existe
                if ($actualite->image && Storage::disk('public')->exists($actualite->image)) {
                    Storage::disk('public')->delete($actualite->image);
                }
                $imagePath = $request->file('image')->store('actualites', 'public');
                $validated['image'] = $imagePath;
            }

            $actualite->update($validated);

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $actualite->id,
                    'titre' => $actualite->titre,
                    'contenu' => $actualite->contenu,
                    'image_url' => $actualite->image ? asset("storage/{$actualite->image}") : null,
                    'date_publication' => $actualite->date_publication->format('Y-m-d'),
                    'auteur' => $actualite->auteur,
                ],
                'message' => 'Actualité mise à jour avec succès'
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $actualite = Actualite::findOrFail($id);
            
            if ($actualite->image && Storage::disk('public')->exists($actualite->image)) {
                Storage::disk('public')->delete($actualite->image);
            }
            
            $actualite->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Actualité supprimée avec succès'
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}