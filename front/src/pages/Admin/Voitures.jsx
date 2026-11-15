// frontend/src/pages/admin/Voitures.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import Button from '../../components/Button';
import FormModal from '../../components/FormModal';
import { FiEdit, FiTrash, FiRefreshCw, FiPlus } from 'react-icons/fi';

function Voitures() {
  const [voitures, setVoitures] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVoiture, setCurrentVoiture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Avec le proxy Vite, utilisez juste /api
  const API_BASE = '/api';

  useEffect(() => {
    fetchVoitures();
  }, []);

  const fetchVoitures = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching from:', `${API_BASE}/voitures`);
      
      const response = await axios.get(`${API_BASE}/voitures`);
      
      console.log('Full API Response:', response.data);
      
      if (response.data.success) {
        // Vérifiez la structure des données
        if (Array.isArray(response.data.data)) {
          setVoitures(response.data.data);
          console.log('Voitures loaded:', response.data.data.length);
        } else {
          console.error('Data is not an array:', response.data.data);
          setError('Les données ne sont pas au bon format');
          setVoitures([]);
        }
      } else {
        setError(response.data.message || 'Erreur API');
        setVoitures([]);
      }
    } catch (err) {
      console.error('Fetch error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url
      });
      
      if (err.response) {
        // Erreur avec réponse du serveur
        setError(`Erreur ${err.response.status}: ${err.response.data?.message || err.message}`);
      } else if (err.request) {
        // Pas de réponse du serveur
        setError('Le serveur ne répond pas. Vérifiez que le serveur Laravel est en cours d\'exécution.');
      } else {
        // Erreur de configuration
        setError(`Erreur: ${err.message}`);
      }
      setVoitures([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const data = new FormData();
    data.append('numero_voiture', formData.get('numero_voiture'));
    data.append('nombre_places', formData.get('nombre_places'));
    data.append('ville_depart', formData.get('ville_depart'));
    data.append('destination', formData.get('destination'));
    data.append('frais', formData.get('frais'));
    data.append('date_voyage', formData.get('date_voyage'));
    data.append('heure_depart', formData.get('heure_depart'));
    
    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      data.append('image', imageFile);
    }

    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'multipart/form-data'
      }
    };

    try {
      console.log('Sending data:', Object.fromEntries(data));
      
      if (currentVoiture) {
        await axios.put(`${API_BASE}/voitures/${currentVoiture.id}`, data, config);
      } else {
        await axios.post(`${API_BASE}/voitures`, data, config);
      }
      
      setIsModalOpen(false);
      setCurrentVoiture(null);
      await fetchVoitures();
      
    } catch (err) {
      console.error('Submit error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette voiture ?')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_BASE}/voitures/${id}`, {
        headers: { 
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      setVoitures(voitures.filter((v) => v.id !== id));
      alert('Voiture supprimée avec succès');
    } catch (err) {
      console.error('Delete error:', err);
      alert('Erreur lors de la suppression: ' + (err.response?.data?.message || err.message));
    }
  };

  // Testez l'API directement depuis le frontend
  const testApiConnection = async () => {
    try {
      const response = await fetch('/api/voitures');
      const data = await response.json();
      console.log('Direct fetch test:', data);
      alert(`Test API: ${data.success ? 'SUCCESS' : 'FAILED'}\nVoitures: ${data.data?.length || 0}`);
    } catch (err) {
      console.error('Test connection error:', err);
      alert('Test connection failed: ' + err.message);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des voitures...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestion des Voitures</h1>
            <p className="text-gray-600 mt-1">
              {voitures.length} voiture{voitures.length > 1 ? 's' : ''} disponible{voitures.length > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              onClick={testApiConnection}
              title="Tester la connexion API"
            >
              <FiRefreshCw className="mr-2" />
              Tester API
            </Button>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center"
            >
              <FiPlus className="mr-2" />
              Nouvelle voiture
            </Button>
          </div>
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erreur de chargement</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                  <button 
                    onClick={fetchVoitures}
                    className="mt-2 text-red-800 hover:text-red-900 underline font-medium"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Liste des voitures */}
        {voitures.length === 0 && !error ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="mx-auto w-24 h-24 mb-6 text-gray-300">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune voiture trouvée</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Commencez par ajouter votre première voiture à la flotte.
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              <FiPlus className="mr-2" />
              Ajouter une voiture
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {voitures.map((voiture) => (
              <div key={voiture.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Image */}
                <div className="h-48 bg-gray-100 overflow-hidden">
                  {voiture.image_url ? (
                    <img 
                      src={voiture.image_url} 
                      alt={voiture.numero_voiture}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Voiture';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Info */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800">{voiture.numero_voiture}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      voiture.disponible 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {voiture.disponible ? 'Disponible' : 'Complet'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-gray-600 mb-4">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{voiture.ville_depart} → {voiture.destination}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{voiture.date_voyage_formate} à {voiture.heure_depart}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 5.197a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span>{voiture.places_disponibles} / {voiture.nombre_places} places</span>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{parseFloat(voiture.frais).toLocaleString()} Ar</span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => {
                        setCurrentVoiture(voiture);
                        setIsModalOpen(true);
                      }}
                    >
                      <FiEdit className="mr-2" />
                      Modifier
                    </Button>
                    <Button 
                      variant="danger"
                      className="flex-1"
                      onClick={() => handleDelete(voiture.id)}
                    >
                      <FiTrash className="mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal pour ajouter/modifier */}
        <FormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentVoiture(null);
          }}
          title={currentVoiture ? 'Modifier la voiture' : 'Ajouter une nouvelle voiture'}
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de la voiture *
              </label>
              <input
                name="numero_voiture"
                defaultValue={currentVoiture?.numero_voiture || ''}
                placeholder="Ex: 325FE"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de places *
              </label>
              <input
                name="nombre_places"
                type="number"
                min="1"
                max="100"
                defaultValue={currentVoiture?.nombre_places || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville de départ *
                </label>
                <input
                  name="ville_depart"
                  defaultValue={currentVoiture?.ville_depart || ''}
                  placeholder="Ex: Antananarivo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination *
                </label>
                <input
                  name="destination"
                  defaultValue={currentVoiture?.destination || ''}
                  placeholder="Ex: Tamatave"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frais (Ar) *
              </label>
              <input
                name="frais"
                type="number"
                step="100"
                min="0"
                defaultValue={currentVoiture?.frais || ''}
                placeholder="Ex: 50000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date du voyage *
                </label>
                <input
                  name="date_voyage"
                  type="date"
                  defaultValue={currentVoiture?.date_voyage?.substring(0, 10) || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure de départ *
                </label>
                <input
                  name="heure_depart"
                  type="time"
                  defaultValue={currentVoiture?.heure_depart || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image {!currentVoiture && '*'}
              </label>
              <input
                name="image"
                type="file"
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="mt-1 text-sm text-gray-500">
                Formats acceptés: JPEG, PNG, JPG, GIF, WEBP (max 5MB)
              </p>
              {currentVoiture?.image_url && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Image actuelle:</p>
                  <img 
                    src={currentVoiture.image_url} 
                    alt="Preview" 
                    className="h-32 w-auto rounded border"
                  />
                </div>
              )}
            </div>
          </div>
        </FormModal>
      </div>
    </AdminLayout>
  );
}

export default Voitures;