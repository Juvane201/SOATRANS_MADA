<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ClientController extends Controller
{
    public function index()
    {
        try {
            // On récupère simplement tous les clients sans faire de jointure complexe
            $clients = Client::orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $clients
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur index clients: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des clients',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:100',
            'prenom' => 'nullable|string|max:100',
            'cin' => 'required|string|max:20',
            'contact' => 'nullable|string|max:20',
        ]);

        try {
            $client = Client::create($validated);
            return response()->json(['success' => true, 'data' => $client], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur', 'error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $client = Client::findOrFail($id);
            return response()->json(['success' => true, 'data' => $client]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Client non trouvé'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $client = Client::findOrFail($id);
            $client->update($request->all());
            return response()->json(['success' => true, 'data' => $client]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $client = Client::findOrFail($id);
            $client->delete();
            return response()->json(['success' => true, 'message' => 'Client supprimé']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur'], 500);
        }
    }
}