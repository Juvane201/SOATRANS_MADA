<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('voiture_id')->constrained()->onDelete('cascade');
            $table->integer('nombre_places_reservees');
            $table->decimal('frais', 8, 2);
            $table->string('ville_depart');
            $table->string('destination');
            $table->date('date_voyage'); // Nouvelle colonne ajoutée
            $table->string('place_reserver')->nullable(); // Nouvelle colonne ajoutée
            
            // Informations complètes du client (sans relation)
            $table->string('nom_client');
            $table->string('prenom_client');
            $table->string('tel_client');
            $table->enum('sexe_client', ['M', 'F', 'Autre']);
            $table->string('email_client')->nullable();
            $table->text('adresse_client')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};