<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateActualitesTable extends Migration
{
    public function up()
    {
        Schema::create('actualites', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->text('contenu');
            $table->dateTime('date_publication')->nullable();
            $table->string('auteur')->nullable();
            $table->string('image')->nullable(); // Champ image facultatif
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('actualites');
    }
}