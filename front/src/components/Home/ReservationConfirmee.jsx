import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  CheckCircle, Car, Calendar, MapPin, Clock, 
  Users, CreditCard, ArrowLeft, Download, Printer
} from 'lucide-react';

const ReservationConfirmee = () => {
  const { reference } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    timeout: 30000
  });

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await api.get(`/reservations/status/${reference}`);
        setReservation(response.data.data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [reference]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Chargement de votre réservation...</p>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Réservation non trouvée</p>
          <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Carte de confirmation */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-green-200">
          {/* En-tête */}
          <div className="bg-gradient-to-r from-green-600 to-teal-500 p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <CheckCircle className="w-8 h-8" />
                  <h1 className="text-3xl font-bold">Réservation confirmée !</h1>
                </div>
                <p className="text-green-100">
                  Votre voyage est maintenant réservé
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-green-200">Référence</div>
                <div className="text-2xl font-bold font-mono">{reference}</div>
              </div>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Informations du client */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 border-b pb-2">
                  Informations du client
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Nom complet</p>
                    <p className="text-lg font-semibold">{reservation.nom_complet}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="text-lg font-semibold">{reservation.telephone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Statut</p>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {reservation.statut}
                    </div>
                  </div>
                </div>
              </div>

              {/* Détails du voyage */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 border-b pb-2">
                  Détails du voyage
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Trajet</p>
                      <p className="font-semibold">
                        {reservation.ville_depart} → {reservation.destination}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-semibold">{reservation.date_voyage_formate}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Heure de départ</p>
                      <p className="font-semibold">{reservation.voiture?.heure_depart}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Détails de la réservation */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Détails de la réservation</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white rounded-lg">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Places réservées</p>
                  <p className="text-2xl font-bold">{reservation.nombre_places_reservees}</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <Car className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Voiture</p>
                  <p className="text-2xl font-bold">{reservation.voiture?.numero_voiture}</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <CreditCard className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Montant total</p>
                  <p className="text-2xl font-bold">€{reservation.frais}</p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-blue-900 mb-3">
                Instructions importantes
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  Présentez cette référence à l'embarquement
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  Arrivez au moins 30 minutes avant le départ
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  Ayez une pièce d'identité avec vous
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 pt-8 border-t">
              <Link
                to="/"
                className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour à l'accueil
              </Link>
              <button
                onClick={handlePrint}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              >
                <Printer className="w-5 h-5 mr-2" />
                Imprimer le reçu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationConfirmee;