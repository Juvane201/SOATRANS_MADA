<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\FactureController;
use App\Http\Controllers\VoitureController;
use App\Http\Controllers\ActualiteController;
use App\Http\Controllers\ContactController; 
use App\Http\Controllers\ReservationController;

// Route de test
Route::get('/', fn() => response()->json(['message' => 'API SOATRANS MNK - MODE TEST']));

// ==========================================
// AUTHENTIFICATION
// ==========================================
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', fn() => response()->json(['message' => 'Déconnecté']));
Route::get('/user', fn() => response()->json(['id' => 1, 'name' => 'Admin Test', 'email' => 'admin@test.com']));

// ==========================================
// VOITURES
// ==========================================
// Route de recherche (doit être avant {voiture} pour ne pas être capturée comme un ID)
Route::get('/voitures/search', [VoitureController::class, 'searchAvailable']);
Route::get('/voitures', [VoitureController::class, 'index']);
Route::post('/voitures', [VoitureController::class, 'store']);

// Attention : on utilise {voiture} pour le Route Model Binding du contrôleur
Route::get('/voitures/{voiture}', [VoitureController::class, 'showPublic']);
Route::put('/voitures/{voiture}', [VoitureController::class, 'update']);
Route::delete('/voitures/{voiture}', [VoitureController::class, 'destroy']);

// ==========================================
// RÉSERVATIONS
// ==========================================
// Routes spécifiques (doivent être avant {reservation})
Route::get('/reservations/check/{reference}', [ReservationController::class, 'checkStatusPublic']);
Route::post('/reservations/public', [ReservationController::class, 'storePublic']);
Route::post('/reservations/check-availability', [ReservationController::class, 'checkAvailabilityPublic']);

Route::get('/reservations', [ReservationController::class, 'index']);
Route::post('/reservations', [ReservationController::class, 'store']);

// Routes avec paramètres
Route::get('/reservations/{reservation}', [ReservationController::class, 'show']);
Route::put('/reservations/{reservation}', [ReservationController::class, 'update']);
Route::delete('/reservations/{reservation}', [ReservationController::class, 'destroy']);

// ==========================================
// FACTURES
// ==========================================
Route::get('/factures', [FactureController::class, 'index']);
Route::post('/factures', [FactureController::class, 'store']);

Route::get('/factures/{facture}', [FactureController::class, 'show']);
Route::put('/factures/{facture}', [FactureController::class, 'update']);
Route::delete('/factures/{facture}', [FactureController::class, 'destroy']);

// ==========================================
// CLIENTS
// ==========================================
Route::get('/clients', [ClientController::class, 'index']);
Route::post('/clients', [ClientController::class, 'store']);

Route::get('/clients/{client}', [ClientController::class, 'show']);
Route::put('/clients/{client}', [ClientController::class, 'update']);
Route::delete('/clients/{client}', [ClientController::class, 'destroy']);

// ==========================================
// ACTUALITÉS
// ==========================================
Route::get('/actualites', [ActualiteController::class, 'indexPublic']);
Route::post('/actualites', [ActualiteController::class, 'store']);

Route::get('/actualites/{actualite}', [ActualiteController::class, 'showPublic']);
Route::put('/actualites/{actualite}', [ActualiteController::class, 'update']);
Route::delete('/actualites/{actualite}', [ActualiteController::class, 'destroy']);

// message EMAIL
Route::post('/messages', [ContactController::class, 'send']);