<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log; // Pour les logs
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
{
    try {
        $request->validate([
            'nom' => 'required|string',
            'code' => 'required|string',
        ]);

        $admin = Admin::where('nom', $request->nom)->first();

        if (!$admin || !Hash::check($request->code, $admin->code)) {
            return response()->json([
                'message' => 'Identifiants incorrects'
            ], 401);
        }

        $token = $admin->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'admin' => $admin,
            'token' => $token,
        ], 200);

    } catch (\Exception $e) {
        // 👇 On renvoie l'erreur exacte au Frontend pour le debug
        return response()->json([
            'message' => 'Erreur serveur',
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ], 500);
    }
}

    public function logout(Request $request)
    {
        // Supprimer le token actuel
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnexion réussie']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}