<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Ajouter le CIN à la table reservations si elle n'existe pas
        Schema::table('reservations', function (Blueprint $table) {
            if (!Schema::hasColumn('reservations', 'cin_client')) {
                $table->string('cin_client')->nullable()->after('tel_client');
            }
        });

        // 2. Ajouter les nouvelles colonnes à la table clients
        Schema::table('clients', function (Blueprint $table) {
            if (!Schema::hasColumn('clients', 'cin')) {
                $table->string('cin')->nullable()->after('prenom');
            }
            if (!Schema::hasColumn('clients', 'contact')) {
                $table->string('contact')->nullable()->after('cin');
            }
            if (!Schema::hasColumn('clients', 'voiture_id')) {
                $table->foreignId('voiture_id')->nullable()->constrained('voitures')->onDelete('set null');
            }
            if (!Schema::hasColumn('clients', 'reservation_id')) {
                $table->foreignId('reservation_id')->nullable()->constrained('reservations')->onDelete('set null');
            }
            if (!Schema::hasColumn('clients', 'place')) {
                $table->string('place')->nullable();
            }
            if (!Schema::hasColumn('clients', 'nombre')) {
                $table->integer('nombre')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn('cin_client');
        });

        Schema::table('clients', function (Blueprint $table) {
            $table->dropForeign(['voiture_id']);
            $table->dropForeign(['reservation_id']);
            $table->dropColumn(['cin', 'contact', 'voiture_id', 'reservation_id', 'place', 'nombre']);
        });
    }
};