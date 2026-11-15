// frontend/src/pages/Actualites.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, Edit, Trash2, Eye, X, CheckCircle, AlertCircle,
  Newspaper, Calendar, Upload, Loader2, Search, Filter,
  ChevronLeft, ChevronRight, Image as ImageIcon
} from 'lucide-react';

const Actualites = () => {
  const [actualites, setActualites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentActualite, setCurrentActualite] = useState(null);
  const [formData, setFormData] = useState({
    titre: '',
    contenu: '',
    categorie: 'Général',
    date_publication: new Date().toISOString().split('T')[0],
    image: null,
    image_url: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState('all');
  const [previewImage, setPreviewImage] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  // Charger les actualités
  useEffect(() => {
    fetchActualites();
  }, []);

  const fetchActualites = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(`${apiUrl}/actualites`, { headers });
      console.log('📰 Actualités chargées:', response.data);
      
      // Normaliser les données
      const data = response.data.data || response.data || [];
      setActualites(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('❌ Erreur chargement actualités:', err);
      setError('Impossible de charger les actualités. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Ouvrir le modal pour ajouter/modifier
  const openModal = (actualite = null) => {
    if (actualite) {
      setCurrentActualite(actualite);
      setFormData({
        titre: actualite.titre || '',
        contenu: actualite.contenu || '',
        categorie: actualite.categorie || 'Général',
        date_publication: actualite.date_publication || new Date().toISOString().split('T')[0],
        image: null,
        image_url: actualite.image_url || ''
      });
      setPreviewImage(actualite.image_url || null);
    } else {
      setCurrentActualite(null);
      setFormData({
        titre: '',
        contenu: '',
        categorie: 'Général',
        date_publication: new Date().toISOString().split('T')[0],
        image: null,
        image_url: ''
      });
      setPreviewImage(null);
    }
    setIsModalOpen(true);
  };

  // Fermer le modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentActualite(null);
    setPreviewImage(null);
  };

  // Gérer les changements du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Gérer l'upload d'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Supprimer l'image
  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null, image_url: '' }));
    setPreviewImage(null);
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vous devez être connecté pour effectuer cette action.');
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('titre', formData.titre);
      formDataToSend.append('contenu', formData.contenu);
      formDataToSend.append('categorie', formData.categorie);
      formDataToSend.append('date_publication', formData.date_publication);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const url = currentActualite 
        ? `${apiUrl}/actualites/${currentActualite.id}`
        : `${apiUrl}/actualites`;
      
      const method = currentActualite ? 'put' : 'post';

      const response = await axios({
        method,
        url,
        data: formDataToSend,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('✅ Actualité sauvegardée:', response.data);
      
      setSuccess(`Actualité ${currentActualite ? 'modifiée' : 'créée'} avec succès !`);
      
      // Rafraîchir la liste
      await fetchActualites();
      
      // Fermer le modal après un délai
      setTimeout(() => {
        closeModal();
        setSuccess(null);
      }, 2000);

    } catch (err) {
      console.error('❌ Erreur sauvegarde:', err);
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une actualité
  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vous devez être connecté.');
        return;
      }

      await axios.delete(`${apiUrl}/actualites/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Actualité supprimée avec succès !');
      await fetchActualites();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('❌ Erreur suppression:', err);
      setError('Erreur lors de la suppression.');
    }
  };

  // Filtrer les actualités
  const filteredActualites = actualites.filter(actu => {
    const matchSearch = actu.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        actu.contenu?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategorie = selectedCategorie === 'all' || actu.categorie === selectedCategorie;
    return matchSearch && matchCategorie;
  });

  // Extraire les catégories uniques
  const categories = ['all', ...new Set(actualites.map(a => a.categorie).filter(Boolean))];

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date non spécifiée';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Composant de chargement
  if (loading && actualites.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des actualités...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Newspaper className="w-8 h-8 text-blue-600" />
            Gestion des Actualités
          </h1>
          <p className="text-gray-500 mt-1">
            {actualites.length} actualité{actualites.length > 1 ? 's' : ''} disponible{actualites.length > 1 ? 's' : ''}
          </p>
        </div>
        
        <button
          onClick={() => openModal()}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">Nouvelle actualité</span>
        </button>
      </div>

      {/* Messages d'état */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-600">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-green-600">{success}</p>
        </div>
      )}

      {/* Filtres et recherche */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher une actualité..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={selectedCategorie}
            onChange={(e) => setSelectedCategorie(e.target.value)}
            className="pl-12 pr-8 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none min-w-[180px]"
          >
            <option value="all">Toutes les catégories</option>
            {categories.filter(c => c !== 'all').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des actualités */}
      {filteredActualites.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-3xl">
          <Newspaper className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-600">Aucune actualité trouvée</h3>
          <p className="text-gray-400 mt-2">
            {searchTerm || selectedCategorie !== 'all' 
              ? 'Aucune actualité ne correspond à vos critères de recherche.'
              : 'Commencez par créer votre première actualité !'}
          </p>
          {!searchTerm && selectedCategorie === 'all' && (
            <button
              onClick={() => openModal()}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Créer une actualité
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActualites.map((actu) => (
            <div
              key={actu.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 group"
            >
              {/* Image */}
              <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {actu.image_url ? (
                  <img
                    src={actu.image_url}
                    alt={actu.titre}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-20 h-20 text-gray-400" />
                  </div>
                )}
                
                {/* Badge catégorie */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-sm font-medium text-gray-800 rounded-full shadow-lg">
                    {actu.categorie || 'Général'}
                  </span>
                </div>
                
                {/* Date */}
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <span className="text-white text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(actu.date_publication)}
                  </span>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {actu.titre}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {actu.contenu}
                </p>
                
                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openModal(actu)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(actu.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-400">
                    ID: {actu.id}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Ajout/Modification */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-slideUp">
            {/* En-tête du modal */}
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                    <Newspaper className="w-6 h-6 text-white animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {currentActualite ? 'Modifier l\'actualité' : 'Nouvelle actualité'}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {currentActualite ? 'Modifiez les informations de l\'actualité' : 'Remplissez les informations pour créer une nouvelle actualité'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Titre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de l'actualité *
                </label>
                <input
                  type="text"
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  placeholder="Ex: Nouvelle ligne vers Nosy Be"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300"
                  required
                />
              </div>

              {/* Contenu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenu de l'actualité *
                </label>
                <textarea
                  name="contenu"
                  value={formData.contenu}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Décrivez votre actualité en détail..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 resize-none"
                  required
                />
              </div>

              {/* Catégorie et Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    name="categorie"
                    value={formData.categorie}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300"
                  >
                    <option value="Général">Général</option>
                    <option value="Nouveauté">Nouveauté</option>
                    <option value="Événement">Événement</option>
                    <option value="Promotion">Promotion</option>
                    <option value="Information">Information</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de publication
                  </label>
                  <input
                    type="date"
                    name="date_publication"
                    value={formData.date_publication}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image {!currentActualite && '*'}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-300 transition-colors duration-300">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer block">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl flex items-center justify-center">
                      <Upload className="w-8 h-8 text-blue-400" />
                    </div>
                    <p className="text-gray-600 mb-2">
                      <span className="text-blue-600 font-medium">Cliquez pour uploader</span> ou glissez-déposez
                    </p>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF jusqu'à 20MB</p>
                  </label>
                </div>

                {/* Prévisualisation */}
                {previewImage && (
                  <div className="mt-4 relative">
                    <p className="text-sm text-gray-500 mb-2">Prévisualisation:</p>
                    <div className="relative inline-block">
                      <img
                        src={previewImage}
                        alt="Prévisualisation"
                        className="w-48 h-48 object-cover rounded-xl border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Boutons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      {currentActualite ? 'Mettre à jour' : 'Créer l\'actualité'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Actualites;