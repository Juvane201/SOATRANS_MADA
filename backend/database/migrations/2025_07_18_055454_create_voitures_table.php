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
        Schema::create('voitures', function (Blueprint $table) {
            $table->id();
            $table->string('numero_voiture')->unique();
            $table->integer('nombre_places');
            $table->string('image')->nullable();
            $table->string('ville_depart');
            $table->string('destination');
            $table->decimal('frais', 8, 2);
            $table->date('date_voyage'); // Nouvelle colonne ajoutée
            $table->time('heure_depart');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('voitures');
    }
};