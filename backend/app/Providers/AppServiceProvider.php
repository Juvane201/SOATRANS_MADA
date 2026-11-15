<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // SOLUTION NUCLÉAIRE TEMPORAIRE (pour confirmer)
        Model::preventAccessingMissingAttributes(); // Laravel 9+
        Model::preventSilentlyDiscardingAttributes(); // Laravel 10+

        // SOLUTION FINALE : désactiver TOUS les événements Eloquent
        // (tant que tu n’as pas trouvé l’observer coupable)
        Model::unsetEventDispatcher();
    }
}