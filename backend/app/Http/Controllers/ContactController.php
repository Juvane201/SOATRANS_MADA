<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        // 1. Valider les données envoyées par React
        $validated = $request->validate([
            'prenom' => 'required|string',
            'nom' => 'required|string',
            'email' => 'required|email',
            'sujet' => 'required|string',
            'message' => 'required|string',
        ]);

        try {
            // 2. Préparer le contenu de l'email
            $emailContent = "
                <h2>Nouveau message depuis SOATRANS</h2>
                <p><strong>De :</strong> {$validated['prenom']} {$validated['nom']}</p>
                <p><strong>Email :</strong> {$validated['email']}</p>
                <p><strong>Sujet :</strong> {$validated['sujet']}</p>
                <p><strong>Message :</strong></p>
                <p>{$validated['message']}</p>
            ";

            // 3. Envoyer l'email (on utilise le driver 'log' ou 'smtp' selon le .env)
            Mail::html($emailContent, function ($message) use ($validated) {
                $message->to('rjnantenaina196@gmail.com')
                        ->subject('SOATRANS - ' . $validated['sujet'])
                        ->from($validated['email'], $validated['prenom'] . ' ' . $validated['nom']);
            });

            return response()->json([
                'success' => true, 
                'message' => 'Email envoyé avec succès'
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur envoi email: ' . $e->getMessage());
            return response()->json([
                'success' => false, 
                'message' => 'Erreur lors de l\'envoi de l\'email',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}